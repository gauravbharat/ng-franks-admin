const mongoose = require("mongoose");
const roleModel = {};
const { roleData } = require("./seedData");
const chalk = require("../utils/chalk.util");

roleModel.Role = mongoose.model(
  "Role",
  new mongoose.Schema(
    {
      roleCode: { type: String, required: true, unique: true, uppercase: true },
      roleName: { type: String, required: true },
      roleCategory: String,
    },
    { timestamps: true }
  )
);

roleModel.loadUserRoles = async () => {
  if ((await roleModel.Role.countDocuments()) === 0) {
    try {
      for (let obj of roleData) {
        await roleModel.Role.collection.insertOne({
          ...obj,
        });
      }
    } catch (error) {
      chalk.logError("Error uploading roles", error);
      // Let admin fix this error before starting the server
      throw new Error(
        "Error uploading required Role collections data into database! Contact Nodejs Admin!!"
      );
    }
  }
};

module.exports = roleModel;
