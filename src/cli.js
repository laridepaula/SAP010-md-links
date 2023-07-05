const { mdlinks } = require('./index.js');
const chalk = require('chalk');
const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
};
mdlinks(path, options)
  .then(({ result, options }) => {
    if (options.validateAndStats) {
      console.log(chalk.green.bold('Validating links:'));
      result.links.forEach((link) => {
        console.log(chalk.yellow(`Link: ${link.href}`));
        console.log(chalk.yellow(`Text: ${link.text}`));
        console.log(chalk.yellow(`File: ${link.file}`));
        console.log(chalk.magenta(`Status: ${link.ok}`));
        console.log(chalk.cyan(`HTTP Status: ${link.status}`));
        console.log(chalk.gray('----------------------------'));
      });
      console.log(chalk.green.bold('Statistics:'));
      console.log(chalk.magenta(`Total links: ${result.statistics.total}`));
      console.log(chalk.magenta(`Unique links: ${result.statistics.unique}`));
      console.log(chalk.bgRed(`Broken links: ${result.statistics.broken}`));
    } else if (options.stats) {
      console.log(chalk.green.bold('Statistics:'));
      console.log(chalk.magenta(`Total links: ${result.statistics.total}`));
      console.log(chalk.magenta(`Unique links: ${result.statistics.unique}`));
      console.log(chalk.bgRed(`Broken links: ${result.statistics.broken}`));
    } else if (options.validate) {
      console.log(chalk.green.bold('Validating links:'));
      result.links.forEach((link) => {
        console.log(chalk.yellow(`Link: ${link.href}`));
        console.log(chalk.yellow(`Text: ${link.text}`));
        console.log(chalk.yellow(`File: ${link.file}`));
        console.log(chalk.magenta(`Status: ${link.ok}`));
        console.log(chalk.cyan(`HTTP Status: ${link.status}`));
        console.log(chalk.gray('----------------------------'));
      });
    } else {
      console.log(chalk.green.bold('Links:'));
      result.links.forEach((link) => {
        console.log(chalk.yellow(`Link: ${link.href}`));
        console.log(chalk.yellow(`Text: ${link.text}`));
        console.log(chalk.yellow(`File: ${link.file}`));
        console.log(chalk.gray('----------------------------'));
      });
    }
  })
  .catch((error) => {
    console.error(error);
  });