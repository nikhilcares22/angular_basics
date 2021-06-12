const express = require("express");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const path =  require("path");
require("dotenv").config();
require("./connection/db");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("./uploads")))
app.use(express.static(path.join(__dirname, '../dist/angular-course/')));
app.use(/^((?!(api|images)).)*/, (req, res) => {
    console.log("in")
  res.sendFile(path.join(__dirname, "../dist/angular-course/index.html"));
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
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
