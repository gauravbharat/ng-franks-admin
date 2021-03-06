const express = require("express");
const router = express.Router();
const { checkAuth } = require("../utils/security.util");
const UserController = require("../controllers/user.controller");

// Get all users
router.get("/all", checkAuth, UserController.getAllUsers);

// Login user
router.post("/login", UserController.loginUser);

// Get all static data for user edits
router.get("/statics", checkAuth, UserController.getUserEditData);

router.post("/update", checkAuth, UserController.updateUserData);

module.exports = router;
