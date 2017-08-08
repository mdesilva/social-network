var User = require('../datasets/users');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports.signup = function(req, res){
  var username = req.body.username;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var fullname = firstname + " "  + lastname;
  var email = req.body.email;
  User.findOne({username: username}, function(err,user){
    if(user){
      //console.log("User already exists!");
      res.json({status:"User already exists!"})
    }
    else{
      bcrypt.hash(req.body.password, null, null, function(err,hash){
        var user = new User();
        user.password = hash;
        user.username = username;
        user.firstname = firstname;
        user.lastname = lastname;
        user.fullname = fullname;
        user.email = email;

        user.save(function(err,docs){
          if(err){
            console.log(err)
          }
          else{
            //console.log("User " + username + " created successfully!");
            res.json({status: "User created successfully!"});
          }
        })
      })
    }
  })
};

passport.use(new LocalStrategy({passReqToCallback: true},
function(req,username,password,done){
  User.findOne({username:username}, function(err,user){
    if(err){
      console.log(err);
      return done(err)
    }
    if(!user){
      console.log("User not found");
      return done(null,false)
    }
    if(user){
      bcrypt.compare(password, user.password, function(err,res){
        if(res){
          console.log("User authenticated!")
          return done(null,user)
        }
        else{
          console.log("Wrong password");
          return done(null,false);
        }
      })
    }
  })
}));

//authenticate user, then handle response back on the route
module.exports.login = passport.authenticate('local')

passport.serializeUser(function(user, done) {  //create cookie in session with the userId
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { //delete cookie
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
