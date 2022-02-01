const fs = require("fs");
const path = require("path");

const clearPublic = () => {
  const directory = "public";
  setInterval(() => {
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }, 86400000 / 2);
};

module.exports = clearPublic;
