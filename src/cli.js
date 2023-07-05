const { mdlinks } = require('./index.js');
const path = process.argv[2];
console.log(process.argv);
mdlinks(path)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
