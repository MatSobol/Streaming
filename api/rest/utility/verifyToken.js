const jwt = require("jsonwebtoken");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const verifyToken = (accessRight) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ Response: "No token" });
    jwt.verify(token, privateKey, (err, user) => {
      if (err) return res.status(403).json({ Response: "Incorrect token" });
      if (user.accessRight < accessRight)
        return res.status(401).json({ Response: "User unauthorized" });
      req.user = user;
      next();
    });
  };
};

module.exports = { verifyToken };
