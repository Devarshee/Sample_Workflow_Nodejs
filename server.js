global.theMongoose = require("mongoose");

require("dotenv").config();

const { MONGODB_URL } = process.env;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

global.theMongoose.Promise = global.Promise;

handleErr = (res, err) => {
  try {
    res.myErr = err.toString();
  } catch (e) {
    res.myErr = "unknown err";
    console.log(err);
  }
  res.status(500).end(err.toString());
};

//Server starts from here
function start() {
  const vehicleRouter = require("./routes/vehicleRoute.js");

  var app = express();
  app.use(cors());

  app.use(bodyParser.json());

  app.use(vehicleRouter);

  const port = process.env.PORT || 5000;
  app.listen(port, function (err) {
    if (err) return console.error(err);
    console.log("app running on port " + port);
  });
}

//Connection with mongodb
global.theMongoose.connection
  .openUri(MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to %s", MONGODB_URL);
    start();
  })
  .catch(err => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });
