require("dotenv").config();
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { CustomError } = require("../error/customError.js");
const { register, loginThirdParty, login } = require("../database/db_auth.js");
const { ACCESS_USERS, ACCESS_THIRD_PARTY } = require("../database/db_auth.js");

const privateKey = process.env.PRIVATE_KEY;

class PasswordsNotMatchedError extends CustomError {
  constructor() {
    super("PasswordNotMatchedError", 400, "Passwords aren't the same");
  }
}

router.post("/register", async (req, res, next) => {
  const body = req.body;
  try {
    if (body.password !== body.repeat_password) {
      throw new PasswordsNotMatchedError();
    }
    await register(body.email, body.password, body.username);
    var token = jwt.sign(
      { name: body.username, email: body.email, accessRight: ACCESS_USERS },
      privateKey
    );
    res.json({
      Response: "Success",
      Token: token,
      Name: body.username,
      AccessRight: ACCESS_USERS,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  const body = req.body;
  try {
    username = await login(body.email, body.password);
    var token = jwt.sign(
      { name: username, email: body.email, accessRight: ACCESS_USERS },
      privateKey
    );
    res.json({
      Response: "Success",
      Token: token,
      Name: username,
      AccessRight: ACCESS_USERS,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    const body = req.body;
    const code = body.accessToken;
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
    });
    const accessToken = response.data.access_token;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userDetails = userResponse.data;
    await loginThirdParty(userDetails.email, userDetails.name);
    var token = jwt.sign(
      {
        name: userDetails.name,
        email: userDetails.email,
        accessRight: ACCESS_THIRD_PARTY,
      },
      privateKey
    );
    res.json({
      Response: "Success",
      Token: token,
      Name: userDetails.name,
      AccessRight: ACCESS_THIRD_PARTY,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/facebook", async (req, res, next) => {
  try {
    const body = req.body;
    url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${body.accessToken}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      return res.status(400).json({ Response: "Incorrect access token" });
    }
    const responseData = response.data;
    await loginThirdParty(responseData.email, responseData.name);
    var token = jwt.sign(
      {
        name: responseData.name,
        email: responseData.email,
        accessRight: ACCESS_THIRD_PARTY,
      },
      privateKey
    );
    res.json({
      Response: "Success",
      Token: token,
      Name: responseData.name,
      AccessRight: ACCESS_THIRD_PARTY,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
