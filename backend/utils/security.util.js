const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

exports.generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, process.env.JWT_SECTRE, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
};

exports.checkAuth = (req, res, next) => {
  try {
    // Split the headers auth token to remove the prefix 'Bearer' before the token
    const token = req.headers.authorization.split(" ")[1];

    // Verify token. jwt.verify() would throw an error if failed
    const decodedToken = jwt.verify(token, process.env.JWT_SECTRE);

    // Pass the username and userId, from the decoded JWT token, to the continuing request object
    req.userData = {
      username: decodedToken.username,
      userId: decodedToken.userId,
    };

    next(); // all good, continue
  } catch (error) {
    console.log("check auth getUserId error", error);
    res.status(401).json({
      message:
        "You are either not authenticated or authorized to perform this action! Please try signing-in again.",
    });
  }
};

exports.hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password must be 8 characters or longer.");
  }

  return bcryptjs.hash(password, 10);
};

exports.matchPassword = (sendPassword, storedPassword) => {
  return bcryptjs.compare(sendPassword, storedPassword);
};
