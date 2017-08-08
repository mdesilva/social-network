var User = require("../datasets/users");


module.exports.searchUsers = function(req,res){
  var searchForUser = req.body.query;
  //console.log("Request to search for user " + searchForUser  + " recieved");
  //search for documents that contain the data in the reqest in some specified field
  var regex = new RegExp(searchForUser, 'i') // pass in 'i' as second param to make it case insensitive
  User.find({"fullname": regex}, function(err, docs){
    if(err){
      console.log(err)
    }
    else{
      if(docs.length > 0){
        //console.log(docs);
        res.json(docs);
      }
      else{
        res.json({message: "No results"})
      }

    }
  })
}
