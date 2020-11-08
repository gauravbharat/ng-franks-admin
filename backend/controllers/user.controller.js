const { returnError } = require("../utils/error.util");
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
exports.loginUser = async (req, res, next) => {};
exports.getUserEditData = async (req, res, next) => {
  try {
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
