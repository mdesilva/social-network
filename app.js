var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var authenticationController = require(__dirname + '/server/controllers/authentication-controller.js');
var profileController = require(__dirname + '/server/controllers/profile-controller.js');
var postController = require(__dirname + '/server/controllers/post-controller.js');
var searchController = require(__dirname + '/server/controllers/search-controller.js');
var User = require(__dirname + "/server/datasets/users");
var app = express();

mongoose.connect('mongodb://localhost:27017/socialNetwork', {useMongoClient: true}) //establish connection to the database with mongoose
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));

db.once('open', function(){
  console.log("Connected to database!")
})

app.use(bodyParser.json()); //read json data
app.use('/public', express.static('public'));
//app.use(session({secret: 'socialnetwork', cookie: {expires: false}})); //store the user session in a cookie
app.use(session({ //store the user session in mongo database DEVELOPMENT ONLY
  secret: 'socialnetwork',
  resave: false,
  saveUninitialized: true,
  maxAge: new Date(Date.now() + 3600000),
  store: new MongoStore(
    {mongooseConnection:db}
  )
}))
app.use(passport.initialize());
app.use(passport.session());
app.listen(3000);

app.get("/", function(req,res){
  res.sendFile(__dirname + "/public/index.html");
})


app.post("/api/user/signup", authenticationController.signup);

app.post("/api/user/login", authenticationController.login, function(req,res){
  res.json(req.user); //the user is stored in a cookie accessible by the user
});

app.get("/api/user/isloggedin", function(req,res){
  if(req.user){
    res.json({status: true, user: req.user})
  }
  else{
    res.json({status: false})
  }
})

app.get("/logout", function(req,res){
  req.logout();
  res.sendStatus(200);
})
app.post("/api/profile/updateUserInfo", profileController.updateUserInfo)
app.post("/api/profile/getUserInfo", profileController.getUserInfo);
app.post("/api/profile/getFriends", profileController.getFriends);
app.post("/api/profile/getFriendRequests", profileController.getFriendRequests);
app.post("/api/profile/getNotifications", profileController.getNotifications);
app.post("/api/profile/archiveNotifications", profileController.archiveNotifications);

app.post("/api/profile/checkRelationship", profileController.checkRelationship);
app.post("/api/profile/requestFriend", profileController.requestFriend);
app.post("/api/profile/cancelRequest", profileController.cancelRequest);
app.post("/api/profile/confirmFriend", profileController.confirmFriend);
app.post("/api/profile/unfriend", profileController.unfriend);


app.post("/api/posts/post", postController.post);
app.post("/api/profile/getUserPosts", postController.getUserPosts);
app.post("/api/posts/getPosts", postController.getPosts);
app.post("/api/posts/getPost",postController.getPost);
app.post("/api/posts/comment", postController.comment);
app.post("/api/posts/likePost", postController.likePost);
app.post("/api/posts/unlikePost", postController.unlikePost);

app.post("/api/search", searchController.searchUsers);
