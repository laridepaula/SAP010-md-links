#! /usr/bin/env node
const { mdlinks } = require('./index.js');
const chalk = require('chalk');
const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
};

mdlinks(path, options)
  .then((result) => {
    if (options.validateAndStats) {
      const totalLinks = result.length;
      const uniqueLinks = new Set(result.map((link) => link.href)).size;
      const brokenLinks = result.filter((link) => link.ok === 'fail').length;

      console.log(chalk.green.bold('Validate statistics:'));
      console.log(chalk.cyan(`Total links: ${totalLinks}`));
      console.log(chalk.magenta(`Unique links: ${uniqueLinks}`));
      console.log(chalk.bgRed(`Broken links: ${brokenLinks}`));
    } else if (options.stats) {
      const totalLinks = result.length;
      const uniqueLinks = new Set(result.map((link) => link.href)).size;

      console.log(chalk.green.bold('Statistics:'));
      console.log(chalk.cyan(`Total links: ${totalLinks}`));
      console.log(chalk.magenta(`Unique links: ${uniqueLinks}`));
    } else if (options.validate) {
      console.log(chalk.green.bold('Validating links:'));
      result.forEach((link) => {
        console.log(chalk.cyan(`Link: ${link.href}`));
        console.log(chalk.magenta(`Text: ${link.text}`));
        console.log(chalk.yellow(`File: ${link.file}`));
        console.log(chalk.green(`Status: ${link.ok}`));
        console.log(chalk.green(`HTTP Status: ${link.status}`));
        console.log(chalk.gray('----------------------------'));
      });
    } else {
      console.log(chalk.green.bold('Links:'));
      result.forEach((link) => {
        console.log(chalk.cyan(`Link: ${link.href}`));
        console.log(chalk.magenta(`Text: ${link.text}`));
        console.log(chalk.yellow(`File: ${link.file}`));
        console.log(chalk.gray('----------------------------'));
      });
    }
  })
  .catch((error) => {
    console.error(error);
  });
