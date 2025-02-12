const express = require("express");
const verifyToken = require("../utility/verifyToken");
const { CustomError } = require("../error/customError.js");
const fs = require("fs");
const path = require("path");
const router = express.Router();

class FileNotFound extends CustomError {
  constructor() {
    super("FileNotFoundError", 404, "Searched file has not been found");
  }
}

router.get("/image/:imagePath", (req, res, next) => {
  try {
    const imagePath = path.join(__dirname, "../uploads", req.params.imagePath);
    console.log(imagePath);
    if (!fs.existsSync(imagePath)) {
      throw new FileNotFound();
    }
    const file = fs.createReadStream(imagePath);
    const filename = new Date().toISOString();
    res.setHeader(
      "Content-Disposition",
      'attachment: filename="' + filename + '"'
    );
    file.pipe(res);
    // res.sendFile(imagePath, "../", (err) => {
    //   if (err) {
    //     throw new FileNotFound();
    //   }
    // });
  } catch (e) {
    next(e);
  }
});

router.get("/video/:videoPath", (req, res) => {
  const range = req.headers.range;
  const videoPath = "./" + req.params.videoPath;
  let videoSize;
  try {
    videoSize = fs.statSync(videoPath).size;
  } catch {
    res.status(400).send();
    return;
  }
  const chunkSize = 1 * 1e6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mkv",
  };
  res.writeHead(206, headers);
  const stream = fs.createReadStream(videoPath, {
    start,
    end,
  });
  stream.pipe(res);
});

module.exports = router;
