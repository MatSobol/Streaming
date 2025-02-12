require("dotenv").config();
const express = require("express");
const {
  addStream,
  getStreams,
  startStream,
  stopStream,
} = require("../database/db_stream.js");
const verifyToken = require("../utility/verifyToken");
const moulter = require("../utility/moulter");
const { start } = require("repl");
const router = express.Router();

router.post(
  "",
  verifyToken.verifyToken(0),
  moulter.upload(),
  async (req, res, next) => {
    try {
      const stream = JSON.parse(req.body.document);
      if (req.file) {
        stream.imagePath = req.file.filename;
        stream.imageName = req.file.originalname;
      }
      stream.account = req.user.name;
      const streamID = await addStream(stream);
      res.json({
        Response: "Success", Id: streamID
      });
    } catch (e) {
      next(e);
      return;
    }
  }
);

router.get(
  "/stop/:id",
  verifyToken.verifyToken(0),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      await stopStream(id);
      res.json({
        Response: "Success"
      });
    } catch (e) {
      next(e);
      return;
    }
  }
);

router.get("", verifyToken.verifyToken(0), async (req, res, next) => {
  try {
    const streams = await getStreams();
    const streamsFromNewest = streams.reverse();
    const response = {
      Response: "Success",
      Streams: streamsFromNewest,
    };
    res.json(response);
  } catch (e) {
    next(e);
    return;
  }
});

module.exports = router;
