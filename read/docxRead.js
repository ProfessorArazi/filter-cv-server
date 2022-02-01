const mammoth = require("mammoth");
const filterFiles = require("../filter/filterFiles");

const docxRead = async (files, keys, option) => {
  const arr = [];
  let filteredArr = [];
  for (let i = 0; i < files.length; i++) {
    arr.push({
      path: files[i].path,
      text: await mammoth
        .extractRawText({ path: files[i].path })
        .then((result) => {
          return result.value;
        }),
    });
  }
  filteredArr = await filterFiles(arr, keys, option);
  return filteredArr.map((x) => x.path);
};
module.exports = docxRead;
