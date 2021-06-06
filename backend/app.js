const express = require("express");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const path =  require("path");
require("dotenv").config();
require("./connection/db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/uploads")))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});
app.use('/api/posts',postRoutes)
app.use('/api/user',userRoutes)

module.exports = app;
