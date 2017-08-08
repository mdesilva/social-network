var mongoose = require('mongoose');
module.exports = mongoose.model('posts', { //create the model for posts
  username: String,
  content: String,
  date: {type: Date, default: Date.now},
  likes: Number,
  liked:[{username:String, _id:false}], //record who liked the post. One user can like a post only once.
  comments: [{username: String, comment: String, likes:Number, liked:[{username: String}], date: {type:Date, default:Date.now}}]
});
