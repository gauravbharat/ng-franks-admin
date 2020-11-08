const mongoose = require("mongoose");
const holdingModel = {};
const { holdingData } = require("./seedData");
const chalk = require("../utils/chalk.util");

holdingModel.Holding = mongoose.model(
  "Holding",
  new mongoose.Schema(
    {
      holdingCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
      },
      holdingOrg: { type: String, required: true },
    },
    { timestamps: true }
  )
);

holdingModel.loadHoldings = async () => {
  if ((await holdingModel.Holding.countDocuments()) === 0) {
    try {
      for (let obj of holdingData) {
        await holdingModel.Holding.collection.insertOne({
          ...obj,
        });
      }
    } catch (error) {
      chalk.logError("Error uploading holdings", error);
      // Let admin fix this error before starting the server
      throw new Error(
        "Error uploading required Holding Orgs collections data into database! Contact Nodejs Admin!!"
      );
    }
  }
};

module.exports = holdingModel;
