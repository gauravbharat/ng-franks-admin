const { returnError } = require("../utils/error.util");
const { generateToken } = require("../utils/security.util");
const {
  validateIdentifier,
  process: { PROCESS_USER },
} = require("../utils/validations.util");

const { User } = require("../models/user.model");
const { Role } = require("../models/role.model");
const { Holding } = require("../models/holding.model");
const { Member } = require("../models/member.model");

exports.getAllUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.userData.userId });

    if (!currentUser || !currentUser.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized Access!",
      });
    }

    const allUsers = await User.find({});

    res.status(200).json({
      message: "All users fetched successfully",
      allUsers,
    });
  } catch (error) {
    return returnError(
      "get-all-users",
      error,
      500,
      "Error fetching all users!",
      res
    );
  }
};
exports.loginUser = async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return returnError(
      "login-user",
      "No user login data received!",
      400,
      "No user login data received!",
      res
    );
  }

  // console.log(req.body);

  // HARD-CODED VALUES
  // req.body = {
  //   username: "jyotiee",
  //   password: "test@123",
  // };

  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.email,
      req.body.password
    );

    if (!user.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized Access!",
      });
    }

    const token = await generateToken(user._id, user.username);

    res.status(201).json({
      message: "User logged-in!",
      userData: {
        user,
        token,
        expiresIn: process.env.EXPIRES_IN_SEC,
      },
    });
  } catch (error) {
    return returnError("login-user", error, 400, "User login failed!", res);
  }
};
exports.getUserEditData = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.userData.userId });

    if (!currentUser || !currentUser.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized Access!",
      });
    }

    const allHoldingOrgs = await Holding.find({});
    const allMemberOrgs = await Member.find({});
    const allUserRoles = await Role.find({});

    res.status(200).json({
      message: "All static data fetched successfully",
      allHoldingOrgs,
      allMemberOrgs,
      allUserRoles,
    });
  } catch (error) {
    return returnError(
      "get-user-edit-data",
      error,
      500,
      "Error fetching static data!",
      res
    );
  }
};

exports.updateUserData = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.userData.userId });

    if (!currentUser || !currentUser.isAdmin) {
      return res.status(401).json({
        message: "Unauthorized Access!",
      });
    }

    const user = await User.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(400).json({
        message: "Invalid user!",
      });
    }

    let result = await User.updateOne(
      { _id: req.body.userId },
      {
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        roles: req.body.roles,
      }
    );

    if (result.n > 0) {
      res.status(200).json({ message: "User updated!" });
    } else {
      res.status(401).json({ message: "user update failed!" });
    }

    // console.log(result.n);
  } catch (error) {
    return returnError(
      "update-user-data",
      error,
      500,
      "Error updating user data!",
      res
    );
  }
};
