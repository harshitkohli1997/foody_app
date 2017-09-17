var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground.js"),
    Comment     = require("../models/comment.js"),
    middleware  = require("../middleware");

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("There has been an error!");
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
//New post route
router.get("/new", middleware.isLoggedin, function(req,res){
    res.render("campgrounds/new");
});
//Post route for New Post form
router.post("/", middleware.isLoggedin, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newGround = {name: name, image: image, description: description, author: author};
    Campground.create(newGround, function(err, newlyCreated){
      console.log(req.user);
        if(err){
            console.log(err);
        } else{
          console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
//Show route for posts
router.get("/:id", function(req, res){
    // POPULATES THE COMMENTS PART OF THE CAMPGROUND SCHEMA WITH
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedPost){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });
});
//Middleware for checking ownership of post
module.exports = router;
