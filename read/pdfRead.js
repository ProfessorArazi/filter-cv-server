const fs = require("fs");
const pdf = require("pdf-parse");
const filterFiles = require("../filter/filterFiles");

const pdfRead = async (files, keys, option) => {
  const arr = [];
  let filteredArr = [];
  for (let i = 0; i < files.length; i++) {
    let dataBuffer = fs.readFileSync(files[i].path);

    arr.push({
      path: files[i].path,
      text: await pdf(dataBuffer).then(function (data) {
        return data.text;
      }),
    });
  }
  filteredArr = await filterFiles(arr, keys, option);
  return filteredArr.map((x) => x.path);
};
module.exports = pdfRead;
