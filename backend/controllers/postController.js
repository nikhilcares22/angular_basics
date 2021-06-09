const Model = require("../models");

exports.createPost = async (req, res, next) => {
  try {
    const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    post.image = url + "/images/" + req.file.filename;
    post.user = req.user._id;
    const data = await Model.Post.create(post);
    res.status(201).json({ message: "Added Successfully.", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Creating a post failed.",
    });
  }
};
exports.getPosts =  async (req, res, next) => {
    try { 
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
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something Wrong Happened.",
      });
    }
  };
exports.getPost = async (req, res, next) => {
  try {
    const posts = await Model.Post.findOne({ _id: ObjectId(req.params.id) });
    if (!posts) return res.status(404).json({ message: "Not Found" });

    res
      .status(200)
      .json({ message: "Post fetched successfully.", posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something Wrong Happened.",
    });
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      req.body.image = url + "/images/" + req.file.filename;
    }
    req.body.user = req.user._id;
    const posts = await Model.Post.findOneAndUpdate(
      {
        _id: ObjectId(req.params.id),
        user: req.user._id,
      },
      { $set: req.body },
      { new: true }
    );

    if (!posts) return res.status(401).json({ message: "Not authorised" });

    res
      .status(200)
      .json({ message: "Posts updated successfully.", posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't Updated Post.",
    });
  }
};
exports.deletPost = async (req, res, next) => {
  try {
    const posts = await Model.Post.findOneAndDelete({
      _id: ObjectId(req.params.id),
      user: req.user._id,
    });

    if (!posts) return res.status(401).json({ message: "Not authorised" });

    res.status(200).json({ message: "Posts deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Deleting a post failed.",
    });
  }
};
