require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
//lodash module
const _ = require('lodash');
const ejs = require("ejs");
const mongoose =require("mongoose");

const homeStartingContent = "This is a simple Blog Website where you can compose a blog and post it.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const resultNotfound = "The content You are looking is not found. Please try to search with another "
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//connecting to mongodb
mongoose.connect(process.env.connectdbs,{ useNewUrlParser:true});

//mongoose schema

const postSchema = new mongoose.Schema({
  title:String,
  content:String
});

//mongoose model

const Post= mongoose.model("Post",postSchema);
  
 
app.get("/", (req, res) => {

  Post.find({},(err,posts)=>{
    res.render("home",{
      Home:homeStartingContent,
      posts:posts
    });
  })

});

app.get("/contact",(req,res)=>{
  res.render("contact",{Contact:contactContent});
});
 
app.get("/about",(req,res)=>{
  res.render("about",{About:aboutContent});
});

 
app.get("/compose",(req,res)=>{
  res.render('compose', {successalert:''});
});


app.post('/compose',(req,res)=>{

const post = new Post({
       title:req.body.compose_heading,
       content:req.body.compose_textarea
})
post.save(function(err){
  if (!err) {
   res.render('compose',{successalert:"Post successfully published!"});
  }
  else{
    res.render('compose',{successalert:"Something went wrong!"});
  }
})
});


app.get('/post/:postreq',(req,res)=>{
 const request=_.lowerCase(req.params.postreq);

    Post.findOne({title:request},(err,result)=>{
      if(result){
        res.render('post',{title:result.title,content:result.content});
      }
      else{
        res.render('post',{title:'Result Not Found!',content:resultNotfound})
      }
    })

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
