const mongoose = require("mongoose");
const memberModel = {};
const { memberData } = require("./seedData");
const chalk = require("../utils/chalk.util");

memberModel.Member = mongoose.model(
  "Member",
  new mongoose.Schema(
    {
      memberCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
      },
      memberOrg: { type: String, required: true },
    },
    { timestamps: true }
  )
);

memberModel.loadMemberOrgs = async () => {
  if ((await memberModel.Member.countDocuments()) === 0) {
    try {
      for (let obj of memberData) {
        await memberModel.Member.collection.insertOne({
          ...obj,
        });
      }
    } catch (error) {
      chalk.logError("Error uploading member orgs", error);
      // Let admin fix this error before starting the server
      throw new Error(
        "Error uploading required Member Orgs collections data into database! Contact Nodejs Admin!!"
      );
    }
  }
};

module.exports = memberModel;
