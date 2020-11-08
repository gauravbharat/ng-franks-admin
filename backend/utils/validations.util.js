const mongoose = require("mongoose");
const chalk = require("./chalk.util");
const validator = {};

validator.process = Object.freeze({
  PROCESS_USER: "PROCESS_USER",
});

validator.validateIdentifier = async (
  processType,
  processSubType,
  identifier,
  res
) => {
  let id;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    id = await mongoose.Types.ObjectId(identifier);
  } else {
    let errorLog = "Invalid ID passed";
    let message = "Invalid request";

    switch (processType) {
      case validator.PROCESS_USER:
        errorLog = `${processSubType}: Invalid userId passed`;
        message = "Invalid User requested!";
        break;
      default:
    }

    chalk.logError(errorLog, identifier);

    res.status(400).json({ message });
  }

  return {
    id,
    res,
  };
};

module.exports = validator;
