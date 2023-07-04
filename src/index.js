const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
const chalk = require("chalk");

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
    throw new Error(chalk.red(`Não há links no arquivo ${filePath}`));
  }
}

const fileRead = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (!filePath.endsWith(".md")) {
          reject(chalk.red(`O arquivo ${filePath} não é um arquivo Markdown válido.`));
          return;
        }
        try {
          const links = extractLinks(data, filePath);
          resolve(links);
        } catch (error) {
          reject(chalk.red(`Não há links no arquivo ${filePath}`));
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
      const contentArray = files ? files.filter((file) => file.endsWith(".md"))
      .map((file) => path.join(pathInput, file)) : [];
      return resolve(contentArray);
    })
  })
}

function validateLink(url) {
  return fetch(url.href)
    .then((response) => ({ ...url, statusCode: response.status, statusMessage: response.statusText }))
    .catch((error) => ({ ...url, statusCode: error.errno, statusMessage: error.message }));
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
  return { total: totalLinks, unique: uniqueLinks };
}
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
