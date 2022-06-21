require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
//lodash module
const _ = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { result } = require("lodash");

const homeStartingContent =
  "This is a simple Blog Website where you can compose a blog and post it.";
const resultNotfound =
  "The content You are looking is not found. Please try to search with another ";
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connecting to mongodb
mongoose.connect(process.env.connectdbs, { useNewUrlParser: true });

//mongoose schema

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//mongoose model

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home", {
      Home: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/search", (req, res) => {
  res.render("search", { Contact:" "});
});

app.post("/search",(req,res)=>{

  const request = _.lowerCase(req.body.search_heading);

 Post.findOne({ title: request }, (err, result) => {
    if (result) {
      res.render("post", { title: result.title, content: result.content });
    } else {
      res.render("post", {
        title: "Result Not Found!",
        content: resultNotfound,
      });
    }
  });
})

app.get("/delete", (req, res) => {
  res.render("delete", { successalert: "" });
});

app.post("/delete", (req, res) => {
  const request = _.lowerCase(req.body.delete_heading);

  Post.findOneAndDelete({ title: request }, (err, result) => {
    if (err) {
      res.render("delete", {
        successalert: "Something Went Wrong Please Try Later !",
      });
    } else {
      res.render("delete", { successalert: "Blog Successfully Deleted !" });
    }
  });
});

app.get("/compose", (req, res) => {
  res.render("compose", { successalert: "" });
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.compose_heading,
    content: req.body.compose_textarea,
  });
  post.save(function (err) {
    if (!err) {
      res.render("compose", { successalert: "Post successfully published!" });
    } else {
      res.render("compose", { successalert: "Something went wrong!" });
    }
  });
});

app.get("/post/:postreq", (req, res) => {
  const request = _.lowerCase(req.params.postreq);

  Post.findOne({ title: request }, (err, result) => {
    if (result) {
      res.render("post", { title: result.title, content: result.content });
    } else {
      res.render("post", {
        title: "Result Not Found!",
        content: resultNotfound,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
