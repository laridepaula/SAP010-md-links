const fs = require("fs");
const path = require ("path");
const fetch = require("cross-fetch");

function extractLinks(markdownContent, filePath) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(markdownContent)) !== null) {
    const text = match[1];
    const href = match[2];
    const link = { href, text, file: filePath };
    links.push(link);
  }

  if (links.length > 0) {
    return links;
  } else {
    throw new Error(`Não há links no arquivo ${filePath}`);
  }
}

const fileRead = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (!filePath.endsWith(".md")) {
          reject(`O arquivo ${filePath} não é um arquivo Markdown válido.`);
          return;
        }
        try {
          const links = extractLinks(data, filePath);
          resolve(links);
        } catch (error) {
          reject(`Não há links no arquivo ${filePath}`);
        }
      }
    });
  });
};

const readDirectory = ( pathInput ) => {
  return new Promise((resolve, reject) =>{
    fs.readdir (pathInput, (err, files) =>{
      if (err){
         reject(err);
      }
      const contentArray = files ? files.filter((file) => file.endsWith(".md")).map((file) => path.join(pathInput, file)) : [];
      return resolve(contentArray);
    })
  })
}

const validateLink = (url) => {
  return fetch(url.href)
    .then((response) => {
      return {
        ...url,
        statusCode: response.status,
        statusMessage: response.statusText,
      };
    })
    .catch((error) => {
      return {
        ...url,
        statusCode: error.errno,
        statusMessage: error.message,
      };
    });
};


const getFileData = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.isFile()) {
        fileRead(path)
          .then((result) => {
            const linkPromises = result.map((link) => validateLink(link));
            Promise.all(linkPromises)
              .then((validatedLinks) => {
                const stats = getLinkStatistics(validatedLinks);
                resolve({ links: validatedLinks, statistics: stats });
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      } else if (stats.isDirectory()) {
        readDirectory(path)
          .then((array) => {
            const promises = array.map((file) => fileRead(file));
            Promise.allSettled(promises)
              .then((results) => {
                const fulfilledFiles = results.filter(
                  (result) => result.status === "fulfilled"
                );
                const values = fulfilledFiles.map((result) => result.value);
                const mergedData = values.reduce((acc, current) =>
                  acc.concat(current)
                );
                const linkPromises = mergedData.map((link) =>
                  validateLink(link)
                );
                Promise.all(linkPromises)
                  .then((validatedLinks) => {
                    const stats = getLinkStatistics(validatedLinks);
                    resolve({ links: validatedLinks, statistics: stats });
                  })
                  .catch((error) => reject(error));
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      } else {
        reject(new Error("Path is neither a file nor a directory."));
      }
    });
  });
};

const getLinkStatistics = (links) => {
  const totalLinks = links.length;
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length;

  return {
    total: totalLinks,
    unique: uniqueLinks,
  };
};
const mdlinks = (path) => {
  return new Promise((resolve, reject) => {
    getFileData(path)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports = {
  extractLinks,
  fileRead,
  readDirectory,
  getFileData,
  mdlinks,
};
