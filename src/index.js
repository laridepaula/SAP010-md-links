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

  if (links.length > 0) {
    return links;
  } else {
    throw new Error(chalk.red(`Não há links no arquivo ${filePath}`));
  }
}
function fileRead(filePaths) {
  let files = [];
  if (Array.isArray(filePaths)) {
    files = filePaths;
  } else {
    files.push(filePaths);
  }
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
    .then((results) =>
      results.reduce((acc, result) => {
        if (result.status === "fulfilled") {
          acc.push(result.value);
        } else {
          console.error(result.reason);
        }
        return acc;
      }, [])
    )
    .then((results) => results.flat());
}

function readDirectory( pathInput ) {
  return new Promise((resolve, reject) =>{
    fs.readdir (pathInput, (err, files) =>{
      if (err){
         reject(err);
      }
      const contentArray = files ? files.filter((file) => file.endsWith(".md"))
      .map((file) => path.join(pathInput, file)) : [];
      return resolve(contentArray);
    })
  })
}

function validateLink(url) {
  return fetch(url.href)
    .then((response) => ({ ...url,
      status: response.status,
      ok: response.ok ? "ok" : "fail",
       }))
    .catch((error) => ({ ...url, 
      status: error.status,
      ok: "fail",
       }));
}

function getFileData(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) reject(err);
      if (stats.isFile()) {
        fileRead(path)
          .then((result) => Promise.all(result.map((link) => validateLink(link))))
          .then((validatedLinks) => resolve({ links: validatedLinks, statistics: getLinkStatistics(validatedLinks) }))
          .catch((error) => reject(error));
      } else if (stats.isDirectory()) {
        readDirectory(path)
          .then((files) => Promise.all(files.map((file) => fileRead(file))))
          .then((results) =>
            Promise.all(results.flat().map((link) => validateLink(link)))
          )
          .then((validatedLinks) => resolve({ links: validatedLinks, statistics: getLinkStatistics(validatedLinks) }))
          .catch((error) => reject(error));
      } else {
        reject(new Error("O caminho não é um diretorio ou arquivo valido"));
      }
    });
  });
}

function getLinkStatistics(links) {
  const totalLinks = links.length;
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length;
  const brokenLinks = links.filter((link) => link.ok === "fail").length;
  return {
    total: totalLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

function mdlinks(path, options) {
  return new Promise((resolve, reject) => {
    getFileData(path)
      .then((result) => resolve({ result, options }))
      .catch((error) => reject(error));
  });
}

module.exports = {
  extractLinks,
  fileRead,
  readDirectory,
  validateLink,
  getFileData,
  getLinkStatistics,
  mdlinks,
};
