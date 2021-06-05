const mongoose = require("mongoose");
const { Schema } = mongoose;
const postSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: "" },
});
module.exports = mongoose.model("Post", postSchema);
