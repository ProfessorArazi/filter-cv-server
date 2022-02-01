const filterFiles = async (files, keys, option) => {
  let cvs = await files;
  if (option === "all") {
    cvs = cvs.filter((cv) => keys.every((key) => cv.text.includes(key)));
  } else {
    cvs = cvs.filter((cv) => keys.some((key) => cv.text.includes(key)));
  }
  return cvs;
};
module.exports = filterFiles;
