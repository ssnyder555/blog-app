let express    = require("express"),
methodOverride = require("method-override"),
app            = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose");


// App Config-
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// Mongoose/Model Config-
let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
let Blog = mongoose.model("Blog", blogSchema)

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

app.get("/blogs/new", function(req, res){
   res.render("new");
});

app.post("/blogs", function(req, res){


   Blog.create(req.body.blog, function(err, newBlog){
       console.log(newBlog);
      if(err){
          res.render("new");
      } else {
          res.redirect("/blogs");
      }
   });
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
      if(err){
          res.redirect("/");
      } else {
          res.render("show", {blog: blog});
      }
   });
});

app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/blogs")
       } else {
           res.render("edit", {blog: blog});
       }
   });
});

app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           res.redirect("/blogs");
       } else {
         res.redirect("/blogs/" + req.params.id);
       }
   });
});

app.delete("/blogs/:id", function(req, res){
   Blog.findByIdRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");

       }
   });
});

app.listen(4000, function(){
  console.log("server is runnning");
})
