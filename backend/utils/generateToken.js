const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "dev_jwt_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

module.exports = generateToken;
