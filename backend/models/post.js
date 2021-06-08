const mongoose = require("mongoose");
const { Schema } = mongoose;
const postSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: "" },
  user: { type: Schema.Types.ObjectId, ref: "User",required:true },
});
module.exports = mongoose.model("Post", postSchema);
