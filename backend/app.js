const express = require("express");
const Model = require("./models");
const bodyParser = require("body-parser");
require("./connection/db")
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS, PUT")
    next();
});

app.post('/api/posts',async(req,res,next)=>{
    const post = req.body;
    const data = await Model.Post.create(post);
    console.log(data)
    res.status(201).json({message:"Added Successfully.",data})
})
app.get("/api/posts", async(req, res, next) => {
  const posts = await Model.Post.find();
  res.status(200).json({ message: "Posts fetched successfully.", posts: posts });
});
app.delete("/api/posts/:id", async(req, res, next) => {
    try { 
        await Model.Post.findOneAndDelete({_id:ObjectId(req.params.id)})
        res.status(200).json({ message: "Posts deleted successfully." });
    } catch (error) {
        
    }
});

module.exports = app;
