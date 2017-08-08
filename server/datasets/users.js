var mongoose = require('mongoose');

var UserModelSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  fullname: String,
  username: String,
  email: String,
  password: String,
  bio: String,
  notifications: [{notificationType:String, content:String, link:String, date:{type:Date, default:Date.now}}],
  prevNotifications: [{notificationType:String, content:String, link:String}],
  friends: [{username: String,fullname:String, _id:false}],
  friendRequests: [{username: String}], //record friend requests
  friendRequested: [{username: String}] //record who the user has requested
})

module.exports = mongoose.model('User', UserModelSchema, 'users');
