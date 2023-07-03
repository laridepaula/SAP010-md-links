const { mdlinks } = require('./index.js');
const path = process.argv[2];
mdlinks(path)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
