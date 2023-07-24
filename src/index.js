const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
const chalk = require("chalk");

function extractLinks(data, filePath) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(data)) !== null) {
    const text = match[1];
    const href = match[2];
    const link = { href, text, file: filePath };
    links.push(link);
  }

  if (links.length === 0) {
    throw new Error(chalk.red(`Não há links no arquivo ${filePath}`));
  }

  return links;
}

function fileRead(filePaths) {
  const files = Array.isArray(filePaths) ? filePaths : [filePaths];

  const filePromises = files.map((filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        if (!filePath.endsWith(".md")) {
          resolve([]);
          return;
        }

        try {
          const links = extractLinks(data, filePath);
          resolve(links);
        } catch (error) {
          reject(chalk.red(`Não há links no arquivo ${filePath}`));
        }
      });
    });
  });

  return Promise.allSettled(filePromises)
    .then((results) => {
      return results.reduce((acc, result) => {
        if (result.status === "fulfilled") {
          acc.push(result.value);
        } else {
          console.error(result.reason);
        }
        return acc;
      }, []);
    })
    .then((results) => results.flat());
}

function readDirectory(pathInput) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathInput, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const contentArray = [];

      const filePromises = files.map((file) => {
        const filePath = path.join(pathInput, file);

        return new Promise((resolveFile, rejectFile) => {
          fs.stat(filePath, (err, stats) => {
            if (err) {
              rejectFile(err);
              return;
            }

            if (stats.isDirectory()) {
              readDirectory(filePath)
                .then((subContentArray) => {
                  contentArray.push(...subContentArray);
                  resolveFile();
                })
                .catch(rejectFile);
            } else if (stats.isFile() && file.endsWith(".md")) {
              contentArray.push(filePath);
              resolveFile();
            } else {
              resolveFile();
            }
          });
        });
      });

      Promise.all(filePromises)
        .then(() => resolve(contentArray))
        .catch(reject);
    });
  });
}

function validateLink(url) {
  return fetch(url.href)
    .then((response) => ({
      ...url,
      status: response.status,
      ok: response.ok ? "ok" : "fail",
    }))
    .catch((error) => ({
      ...url,
      status: error.status,
      ok: "fail",
    }));
}

function getFileData(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.isFile()) {
        fileRead(path)
          .then(resolve)
          .catch(reject);
      } else if (stats.isDirectory()) {
        readDirectory(path)
          .then((array) => {
            const promises = array.map((file) => fileRead(file));
            Promise.allSettled(promises)
              .then((results) => {
                const fulfilledFiles = results.filter((result) => result.status === "fulfilled");
                const values = fulfilledFiles.map((result) => result.value);
                const mergeData = values.reduce((acc, current) => acc.concat(current));
                resolve(mergeData);
              })
              .catch(reject);
          })
          .catch(reject);
      } else {
        reject(new Error("Caminho fornecido não é um arquivo ou diretorio."));
      }
    });
  });
}

function mdlinks(path, options = { validate: true }) {
  return new Promise((resolve, reject) => {
    getFileData(path)
      .then((result) => {
        if (options.validate) {
          const promises = result.map((link) => validateLink(link));
          Promise.allSettled(promises)
            .then((validatedLinks) => {
              const linksWithValidation = result.map((link, index) => ({
                ...link,
                ...validatedLinks[index].value,
              }));
              resolve(linksWithValidation);
            })
            .catch(reject);
        } else {
          resolve(result);
        }
      })
      .catch(reject);
  });
}

module.exports = {
  extractLinks,
  fileRead,
  readDirectory,
  validateLink,
  getFileData,
  mdlinks,
};
