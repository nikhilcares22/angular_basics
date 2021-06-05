const express = require("express");
const Model = require("../models");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const post = req.body;
  const data = await Model.Post.create(post);
  res.status(201).json({ message: "Added Successfully.", data });
});

router.get("/", async (req, res, next) => {
  const posts = await Model.Post.find();
  res
    .status(200)
    .json({ message: "Posts fetched successfully.", posts: posts });
});

router.get("/:id", async (req, res, next) => {
  const posts = await Model.Post.findOne({ _id: ObjectId(req.params.id) });

  if (!posts) return res.status(404).json({ message: "Not Found" });

  res.status(200).json({ message: "Post fetched successfully.", posts: posts });
});

router.put("/:id", async (req, res, next) => {
  const posts = await Model.Post.findOneAndUpdate(
    {
      _id: ObjectId(req.params.id),
    },
    { $set: req.body },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Posts updated successfully.", posts: posts });
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Model.Post.findOneAndDelete({ _id: ObjectId(req.params.id) });
    res.status(200).json({ message: "Posts deleted successfully." });
  } catch (error) {}
});

module.exports = router;
