const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const chalk = require("./utils/chalk.util");

const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

const userRoutes = require("./routes/user.routes");

/** Get seed data */
const { loadHoldings } = require("./models/holding.model");
const { loadMemberOrgs } = require("./models/member.model");
const { loadUserRoles } = require("./models/role.model");
const { loadUsers } = require("./models/user.model");

const init = () => {
  /** Parse incoming req.body data to json() format */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  /** Intercept incoming requests and allow CORS by setting following headers to -
   * Allow ANY origin access,
   * Allow SPECIFIC header requests, and
   * Allow SPECIFIC REST access verbs
   * Tip: OPTIONS are passed along with the POST call
   */
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

  /** Recognize the build folder for the angular app */
  app.use(express.static(__dirname + "/angular"));

  app.use("/api/users", userRoutes);
  app.use("", (req, res, next) => {
    res.status(401).send("Invalid API requested!");
  });

  // app.get("", (req, res) => {
  //   // res.render("pagenotfound");
  //   res.render("pagenotfound");
  // });
};

const seedData = (load) => {
  if (load) {
    /** Even if load === true, load seed data conditionally inside these functions */
    loadHoldings();
    loadMemberOrgs();
    loadUserRoles();
    loadUsers();
  }
};

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(
    `mongodb+srv://${process.env.DBUSER}:${process.env.DBCRED}@cluster0.kwjzp.gcp.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
  )
  .then((res) => chalk.logSuccess("Database connected:", process.env.DBNAME))
  .then(() => seedData(true))
  .then(() => init())
  .then(() =>
    app.listen(port, () => {
      chalk.logSuccess(`Server started and listening at port: ${port}`);
    })
  )
  .catch((err) =>
    chalk.logError(
      "Critical error connecting database and starting server...",
      err
    )
  );
