const express = require("express");
const router = express.Router();
const { checkAuth } = require("../utils/security.util");
const UserController = require("../controllers/user.controller");

// Get all users
router.get("/all", checkAuth, UserController.getAllUsers);

// Login user
router.get("/login", UserController.loginUser);

// Get all static data for user edits
router.get("/edit-data", checkAuth, UserController.getUserEditData);

module.exports = router;
