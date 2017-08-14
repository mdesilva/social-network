var Post = require('../datasets/posts')
var User = require('../datasets/users')

var getWhoLiked = function(docs,currentUser){
  var usersWhoLiked = [];
  docs.forEach(function(post){ //for each post in the document
    post.liked.forEach(function(user){ //push each user who liked the post into an array
      usersWhoLiked.push(user.username);
      if(usersWhoLiked.indexOf(currentUser) === -1){
        post.userLiked = false;
      }
      else{
      post.userLiked = true;
    }
  })
  usersWhoLiked = [];//reset the array
  })
}

module.exports.post = function(req,res){
  var username = req.body.username;
  var newPost = new Post(req.body); //save the new post to the post collection
  newPost.save(function(err){
    if(err){
      console.log(err)
    }
    else{
      User.findOneAndUpdate({"username": username}, {$push: {"posts": {content: req.body.content}}}, function(err, docs){ //save the post under that user's posts as well
        if(err){                      //push to posts array under the user model
          console.log(err);
        }
        })
      res.json({status: 200});
    }
  });
}

module.exports.getUserPosts = function(req, res){
  var username = req.body.username;
  var query = Post.find({ "username": username}).sort({date: -1}).lean(); //find the posts that are filed under the current user
  query.exec(function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      getWhoLiked(docs,req.body.username);
      res.json(docs)//send back all the posts that are filed under the user
    }
  })
}

module.exports.getPosts = function(req,res){ //get posts of users that the user is friends with // .lean() returns a json object that you can manipulate rather than a model that you usually get!
  var username = req.body.username;
  var friends = [];
  friends.push(username);
  var query = User.findOne({"username":username}, {"friends":true, _id:false}).lean();
  query.exec(function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      docs.friends.forEach(function(friend){
        friends.push(friend.username);
      })
        Post.find({username : { $in: friends }}).sort({date: -1}).lean().exec(function(err, docs){ //send back all the posts on the database to the controller
          if(err){
            console.log(err)
          }
          else{
            getWhoLiked(docs, req.body.currentUser);
            res.json(docs);
          }
        })
      }
    })
  }

module.exports.getPost = function(req,res){
  var currentUser = req.body.currentUser;
  var postId = req.body.postId;
  var query = Post.find({_id:postId}).lean()
  query.exec(function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      getWhoLiked(docs, currentUser);
      res.json(docs);
    }
  })
}

module.exports.comment = function(req,res){
  var postId = req.body.postId;
  var username = req.body.currentUser;
  var comment = req.body.comment;
  Post.findOneAndUpdate({_id: postId}, {$push:{"comments": {username: username, comment:comment }}}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      Post.findOne({_id:postId}, {username:true, _id:false}, function(err,docs){
        if(err){
          console.log(err);
        }
        else{
          var author = docs.username
          if(author === username){ //the user has commented on his own post
            res.sendStatus(200)
          }
          else{ //a user other than the author of the post has commented on the post, so we will push a notification to that user notifiying them of the comment
            User.findOneAndUpdate({username: author},{$push: {"notifications": {notificationType:"comment", content:(username + " commented on your post"), link: postId }}}, function(err,docs){
              if(err){
                console.log(err);
              }
              else{
                res.sendStatus(200);
              }
            })
          }
        }
      })
    }
  })
}

module.exports.likePost = function(req,res){
  var username = req.body.currentUser;
  var postId = req.body.postId;
  //find if the user liked the post
  Post.find({_id:postId}, {liked: {$elemMatch:{username: username}}}, function(err,docs){
    if(err){
      console.log(err)
    }
    if(docs[0].liked.length === 0){
      //the current user did not like the post yet
      //increase the number of likes by 1
      Post.findOneAndUpdate({_id:postId}, {$inc: {likes:1}}, function(err,docs){
        if(err){
          console.log(err)
        }
        else{
          //push the user into the array of users that liked that post
          Post.findOneAndUpdate({_id:postId}, {$push: {"liked": {username: username}}}, function(err,docs){
            if(err){
              console.log(err)
            }
            else{
              Post.findOne({_id:postId}, {username:true, _id:false}, function(err,docs){
                if(err){
                  console.log(err)
                }
                else{
                  var author = docs.username;
                  if(author === username){//the user liked his own post
                    res.sendStatus(200)
                  }
                  else{ //the user who liked the post is not the author; so we will push a notification to the author
                    User.findOneAndUpdate({username: author},{$push: {"notifications": {notificationType:"like", content:(username + " liked your post"), link:postId}}}, function(err,docs){
                      if(err){
                        console.log(err);
                      }
                      else{
                        res.sendStatus(200);
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
    else{
      console.log("User already liked post");
    }
})
}

module.exports.unlikePost = function(req,res){
  var postId= req.body.postId;
  var username = req.body.currentUser;
  Post.findOneAndUpdate({_id:postId}, {$inc:{likes:-1}}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      Post.findOneAndUpdate({_id:postId}, {$pull:{"liked":{username:username}}}, function(err,docs){
        if(err){
          console.log(err)
        }
        else{
          res.sendStatus(200);
        }
      })
    }
  })
}
