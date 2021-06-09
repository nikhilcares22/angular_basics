const express = require("express");
const { jwtService } = require("../common");
const Model = require("../models");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const user = new Model.User({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    return res.status(201).json({
      message: "User Successfully created",
      result: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Invalid authentication credentials!",
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let userExists = await Model.User.findOne({ email: req.body.email });
    if (!userExists) return res.status(401).json({ message: "Invalid Authentication credentials" });
    const ifUserPass = await userExists.authenticate(req.body.password);
    if (!ifUserPass) return res.status(401).json({ message: "Invalid Authentication credentials" });
    const token = await jwtService.sign({
      id: userExists._id,
      email: userExists.email,
    });
    return res.status(200).json({ token, expiresIn: 3600,userId:userExists._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
