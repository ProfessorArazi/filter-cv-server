const express = require("express");
const multer = require("multer");
const cors = require("cors");
const validator = require("validator");
const pdfRead = require("./read/pdfRead");
const docxRead = require("./read/docxRead");
const mailSender = require("./mail/mailSender");
const clearPublic = require("./clear/clearPublic");

const app = express();

app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send({ message: "working" });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).array("file");

clearPublic();

app.post("/upload/:keys/:email/:option", (req, res) => {
  const email = req.params.email;

  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: "Please Add Valid Mail" });
  }

  const keys = req.params.keys.split(",");
  const option = req.params.option;
  if (keys.length === 0) {
    return res.status(400).send({ message: "Please Add Keys" });
  }
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Something Wrong Happend, Please Try Again Later" });
    }
    if (req.files.length === 0) {
      return res.status(400).send({ message: "Please Upload Files" });
    }
    let pdfFiles = req.files.filter((file) =>
      file.originalname.includes("pdf")
    );
    let docxFiles = req.files.filter(
      (file) => !file.originalname.includes("pdf")
    );

    const filteredPdf = await pdfRead(pdfFiles, keys, option);
    const filteredDocx = await docxRead(docxFiles, keys, option);

    const filteredCvs = [...filteredPdf, ...filteredDocx];
    if (filteredCvs.length > 0) {
      try {
        mailSender(email, filteredCvs);
      } catch (err) {
        return res
          .status(500)
          .send({ message: "Something Wrong Happend, Please Try Again" });
      }
      res.status(200).send({ success: "success" });
    } else {
      res
        .status(404)
        .send({ message: "Couldnt Find CV That Matches Your Keys" });
    }
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;
