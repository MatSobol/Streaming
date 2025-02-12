const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
};

const mongoClient = require("./database/mongoClient.js");
mongoClient.connectToServer().then(() => {
  const CustomError = require("./error/customError.js");
  const auth = require("./routes/auth");
  const media = require("./routes/media");
  const stream = require("./routes/stream");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());

  app.use(cors(corsOptions));

  app.use("/auth", auth);
  app.use("/media", media);
  app.use("/stream", stream);

  app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof CustomError.CustomError) {
      res.status(err.statusCode).json({
        Response: err.message,
      });
    } else {
      res.status(500).json({
        Response: `Problem with server. ${err.message}`,
      });
    }
  });

  app.listen(8000, () => {
    console.log("Server running on port 8000");
  });
});
