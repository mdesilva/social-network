var User = require('../datasets/users');
var fs = require('fs-extra');
var path = require('path');
var Post = require('../datasets/posts');
var searchable = require('mongoose-searchable');
var mongoose = require('mongoose');
module.exports.updatePhoto = function(req,res){
  console.log("request from " + req.url)
  var file = req.files.file;
  var userId = req.body.userId;
  console.log("User " + userId + " is submitting file");

  var uploadDate = new Date();

  var tempPath = file.path;
  var targetPath = path.join(__dirname, "../../uploads/" + userId + uploadDate + file.name)
  var savePath = "/uploads/" + userId + uploadDate + file.name;

  fs.rename(tempPath, targetPath, function(err){ //save file
    if(err) {
      console.log(err);
    }
    else{
      console.log("File moved");
      User.findById(userId, function(err,docs){ //find user
        var user = docs;
        user.image = savePath; //set that users image in the database to the save path
        user.save(function(err){
          if(err){
            console.log(err)
            res.json( {status: 500}); //if theres an error when saving, send back an error code to the client
          }
          else{
            console.log("save successful");
            res.json({ status: 200}); //else post successful 200 message
          }
        })
      })
    };
  })
};

module.exports.updateUserInfo = function(req,res) {
  //console.log("Request to update user info recieved")
  var username = req.body.username;
  User.findOne({"username": username}, function(err,user){ //find the user by his unique id
    user.username = req.body.username; //update his info
    user.bio = req.body.bio;
    user.save(function(err){ //then save and catch an error if need be
      if(err){
        console.log(err);
        res.json({status: 500});
      }
      else{
        res.json({status: 200});
      }
    })
  })
}

module.exports.getUserInfo = function(req, res){
  var username = req.body.username;
  User.findOne({"username": username}, function(err, user){ //get user information via their username
    if(err){
      console.log(err);
    }
    else{
      var response = {
        fullname: user.fullname,
        bio: user.bio
      };
      res.json(response); //send back the response. Access the response data with response.data.element
    }
  })
}


module.exports.getFriendRequests = function(req,res){
  var username = req.body.username;
  User.find({username: username}, {"friendRequests": true, _id:false}, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      var friendRequests = docs[0].friendRequests;
      if(friendRequests.length === 0){ //no friend requests found
        res.json({noFriendRequests: "You do not have any friend requests"})
      }
      else{ //at least one friend requests was found
        res.json({friendRequests:friendRequests})
      }
    }
  })
}


module.exports.getFriends = function(req,res){
  var username = req.body.username;
  User.findOne({username: username}, {"friends": true, _id:false}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      res.json(docs.friends);
    }
  })
}

module.exports.checkRelationship = function(req,res){
  //check if userOne and userTwo have any connection
  var userOneUserName = req.body.userOneUserName;
  var userTwoUserName = req.body.userTwoUserName;
  //use $elemMatch to look for a specific element in an array
  //check if userOne and userTwo are friends

  var checkFriends = User.find({username: userOneUserName}, {friends: { $elemMatch: {username: userTwoUserName}}});

  checkFriends.exec(function(err,docs){
    var result = (docs[0].friends[0]); //get Friends field from returned object
    //console.log(result);

    if(result === undefined){ //userOne and userTwo are not friends
      //console.log("Friend does not exist")

      //check if userOne requested userTwo
      var checkRequested = User.find({username: userOneUserName}, {friendRequested: { $elemMatch: {username: userTwoUserName}}});
      checkRequested.exec(function(err,docs){
        var result = (docs[0].friendRequested[0])
        if(result === undefined){ //userOne has not requested userTwo
          //console.log(userOneUserName + " has not requested " + userTwoUserName);

          //check if userOne has a request from userTwo
          var checkRequests = User.find({username: userOneUserName}, {friendRequests: { $elemMatch: {username: userTwoUserName}}});
          checkRequests.exec(function(err,docs){
            var result = (docs[0].friendRequests[0]);
            if(result === undefined){ //userOne does not have a request from userTwo
              //console.log(userOneUserName + " does not have a friend request from " + userTwoUserName);
              res.json({status:"Request friend", action: "requestFriend"})
            }
            else{ //userOne does have a request from userTwo
              //console.log(userTwoUserName + " has requested to be friends with " +userOneUserName)
              res.json({status: "Confirm friend", action: "confirmFriend"})
            }
          })
        }

        else{ //userOne has requested userTwo
          //console.log(userOneUserName + " has already requested " + userTwoUserName);
          res.json({status:"Cancel request", action: "cancelRequest"})
        }
      })
    }

    else{ //userOne and userTwo are already friends. Provide option to unfriend.
      //console.log("Friend exists")
      res.json({status:"Unfriend", action:"unfriend"})
    }
  })

};

module.exports.requestFriend = function(req,res){
  var userOneUserName = req.body.userOneUserName;
  var userTwoUserName = req.body.userTwoUserName //userOne is requesting to be friends with userTwo.))

  //We will push userOne into userTwo's friend requests array.

  User.findOneAndUpdate({username: userTwoUserName},{$push: {"friendRequests": {username: userOneUserName}}}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      //push userTwo into userOne's friend requested array
      User.findOneAndUpdate({username: userOneUserName},{$push: {"friendRequested": {username: userTwoUserName}}}, function(err,docs){
        if(err){
          console.log(err)
        }
        else{
          User.findOneAndUpdate({username: userTwoUserName}, {$push:{"notifications": {notificationType: "friendRequest", content:("New friend request from " + userOneUserName)}}}, function(err,docs){
            if(err){
              console.log(err)
            }
            else{
              console.log("Notifications updated!")
              res.sendStatus(200);
            }
          })
        }
      })
      //console.log(userOneUserName + " successfully requested to be " + userTwoUserName + "'s friend");
    }
  })
}

module.exports.cancelRequest = function(req,res){
  var userOneUserName = req.body.userOneUserName;
  var userTwoUserName = req.body.userTwoUserName;

  //pull userTwo from userOne's friendRequested array
  User.findOneAndUpdate({username: userOneUserName}, {$pull: {"friendRequested": {username: userTwoUserName}}}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      //pull userOne from userTwo's friendRequests array
      User.findOneAndUpdate({username: userTwoUserName}, {$pull: {"friendRequests": {username: userOneUserName}}}, function(err,docs){
        if(err){
          console.log(err)
        }
        else{
          res.json({status:200})
        }
      })
    }
  })
}

module.exports.confirmFriend = function(req,res){
  var userOneUserName = req.body.userOneUserName;
  var userTwoUserName = req.body.userTwoUserName;
  console.log(userOneUserName);
  console.log(userTwoUserName);
  //userOne is confirming userTwo as their friend.
  //So, we will pull(delete) userTwo from userOne's friendRequests array.


  User.findOneAndUpdate({username: userOneUserName}, {$pull: {"friendRequests": {username: userTwoUserName}}}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      //Pull userOne from userTwo's friendRequested array.
      User.findOneAndUpdate({username: userTwoUserName}, {$pull: {"friendRequested": {username: userOneUserName}}}, function(err, docs){
        if(err){
          console.log(err)
        }
        else{
          //Then, push userTwo to userOne's confirmed friend list
          User.findOneAndUpdate({username: userOneUserName}, {$push: {"friends": {username: userTwoUserName}}}, function(err,docs){
            if(err){
              console.log(err)
            }
            else{
              //console.log(userTwoUserName + " successfully pulled from friend requests and confirmed as an official friend of " + userOneUserName)
              //Then, also add userOne as a friend of userTwo.
              User.findOneAndUpdate({username: userTwoUserName}, {$push: {"friends": {username: userOneUserName}}}, function(err,docs){
                if(err){
                  console.log(err)
                }
                else{
                //  console.log(userOneUserName + " is now a friend of " + userTwoUserName);
                }
              })
            }
          })
        }
      })
    }
  })
  res.json({status: 200});
}

module.exports.unfriend = function(req,res){
  var userOneUserName = req.body.userOneUserName;
  var userTwoUserName = req.body.userTwoUserName;

  //pull userTwo from userOne's friends array
  User.findOneAndUpdate({username: userOneUserName}, {$pull: {"friends": {username: userTwoUserName}}}, function(err,docs){
    if(err){
      console.log(err)
    }
    else{
      //pull userOne from userTwo's friends array
      User.findOneAndUpdate({username: userTwoUserName}, {$pull: {"friends": {username: userOneUserName}}}, function(err,docs){
        if(err){
          console.log(err)
        }
        else{
          res.json({status:200})
        }
      })
    }
  })
}


module.exports.getNotifications = function(req,res){
  var username = req.body.currentUser;
  User.findOne({username: username}, {"notifications":true,"prevNotifications":true, _id:false}, function(err,docs){
    if(err){
      console.log(err)
    }
    if(docs.notifications.length > 0){
      res.json({length:docs.notifications.length, notifications:docs.notifications});
    }
    else{
      res.json({length:0,noNotifications:"You have no notifications"});
    }
  })
}

module.exports.archiveNotifications = function(req,res){
  var username = req.body.currentUser;
  var notifications = req.body.notifications;
  notifications.forEach(function(notification){
    //pull the notification out of the current notifications array
    var query = User.findOneAndUpdate({username:username}, {$pull:{"notifications":{_id: notification._id}}});
    query.exec(function(err,docs){
      if(err){
        console.log(err)
      }
      else{
      //push the notification into the previous notifications array
      User.findOneAndUpdate({username:username}, {$push:{"prevNotifications":{content: notification.content}}}, function(err,docs){
        if(err){
          console.log(err);
        }
      })
    }
    })
  })
  //can only send one response for each request, so send back the response after the entire array of notifications has been processed
  res.sendStatus(200);
}
