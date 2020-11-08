const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword, matchPassword } = require("../utils/security.util");
const userModel = {};
const { userData } = require("./seedData");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    title: { type: String, required: true },
    password: String,
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQJS3-GoTF9xqAIyRROWdTD8SUihnSdP5Ac2uPb6AzgGHHyeuuD",
    },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isSuperdmin: { type: Boolean, default: false },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    holding: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Holding",
      },
    ],
    member: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  { timestamps: true }
);

/** Hash the plain text password before save */
userSchema.pre("save", async (next) => {
  const user = this;

  // hash only on signup process or if user modifies the password
  if (user.isModified("password")) {
    user.password = await hashPassword(user.password);
  }

  /** Allow SuperAdmin rights set by the DBA, and not from any app or this API */
  if (user.isModified("isSuperdmin")) {
    console.log(`At time: ${new Date()}`);
    console.log(
      `isSuperAdmin change attempted on user _id:${user._id} username: ${username}`
    );
    throw new Error(
      "FORBIDDEN!!! You're not authorized to change system security settings. Contact the administrator!"
    );
  }

  // Proceed with execution of next line of code
  next();
});

/** Remove the password field before passing user object to client
 * This method is called whenever the conversion to json happen on this object
 * either implicitly or explicitly
 */
userSchema.methods.toJSON = function () {
  const user = this;

  // Make a copy
  const userObject = user.toObject();

  delete userObject.password;
  return userObject;
};

/** Find user using passed credentials and return */
userSchema.statics.findByCredentials = async (username, email, password) => {
  let user;

  if (username) {
    user = await userModel.User.findOne({ username })
      .populate("roles")
      .populate("holdings")
      .populate("members")
      .exec();
  }

  if (!user && email) {
    user = await userModel.User.findOne({ email })
      .populate("roles")
      .populate("holdings")
      .populate("members")
      .exec();
  }

  if (!user) {
    throw new Error(`Login failed!`);
  }

  const isMatch = await matchPassword(password, user.password);
  if (!isMatch) {
    throw new Error(`Login failed!`);
  }

  return user;
};

userModel.User = mongoose.model("User", userSchema);

userModel.loadUsers = async () => {
  if ((await userModel.User.countDocuments()) === 0) {
    try {
      for (let obj of userData) {
        await userModel.User.collection.insertOne({
          ...obj,
          password: await hashPassword(obj.password),
        });
      }
    } catch (error) {
      chalk.logError("Error uploading users", error);
      // Let admin fix this error before starting the server
      throw new Error(
        "Error uploading required User collections data into database! Contact Nodejs Admin!!"
      );
    }
  }
};

module.exports = userModel;
