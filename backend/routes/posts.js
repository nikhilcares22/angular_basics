const express = require("express");
const router = express.Router();
const uploadService = require("../middleware/upload");
const PostController = require("../controllers/postController");
const jwtService = require("../common/jwtService");

router.post(
  "/",
  jwtService.verify("user")
  ,uploadService.single('image'),
  PostController.createPost
);

router.get(
  "/",
  PostController.getPosts
);

router.get("/:id", PostController.getPost);

router.put(
  "/:id",
  jwtService.verify("user"),
  uploadService.single('image'),
  PostController.updatePost
);

router.delete("/:id", jwtService.verify("user"), PostController.deletPost);

module.exports = router;
