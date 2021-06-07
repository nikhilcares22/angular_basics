const express = require("express");
const Model = require("../models");
const router = express.Router();
const multer = require("multer");
const jwtService = require("../common/jwtService");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime-Type");
    if (isValid) error = null;
    cb(error, "backend/uploads");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/",
  jwtService.verify("user"),
  multer({ storage }).single("image"),
  async (req, res, next) => {
    const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    post.image = url + "/images/" + req.file.filename;
    const data = await Model.Post.create(post);
    res.status(201).json({ message: "Added Successfully.", data });
  }
);

router.get("/", async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Model.Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  const posts = await postQuery;
  const postCount = await Model.Post.countDocuments();
  res.status(200).json({
    message: "Posts fetched successfully.",
    posts: posts,
    maxPosts: postCount,
  });
});

router.get("/:id", async (req, res, next) => {
  const posts = await Model.Post.findOne({ _id: ObjectId(req.params.id) });
  if (!posts) return res.status(404).json({ message: "Not Found" });

  res.status(200).json({ message: "Post fetched successfully.", posts: posts });
});

router.put(
  "/:id",
  jwtService.verify("user"),
  multer({ storage }).single("image"),
  async (req, res, next) => {
    console.log(req.body);
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      req.body.image = url + "/images/" + req.file.filename;
    }
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
  }
);

router.delete("/:id", jwtService.verify("user"), async (req, res, next) => {
  await Model.Post.findOneAndDelete({ _id: ObjectId(req.params.id) });
  res.status(200).json({ message: "Posts deleted successfully." });
});

module.exports = router;
