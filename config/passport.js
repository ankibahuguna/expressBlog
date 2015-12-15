var LocalStrategy=require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt=require('bcrypt');

module.exports=function(passport){

  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });

  passport.use('local-signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
  },
  function(req,email,password,done){
    process.nextTick(function(){
      User.findOne({'eamil':email},function(err,user){
        if(err)
        return done(err);
        if(user){
          return done(null,false,req.flash('signupMessage','This email is already taken'));

        }
        else{
          var newUser=new User();
          newUser.email=email;
          newUser.Name=req.body.uname;
          bcrypt.genSalt(10, function(err, salt) {
            if(err)
            return done(err);
        bcrypt.hash(password, salt, function(err, hash) {
          if(err)
            return done(err);
            newUser.password=hash;
            newUser.save(function(err){
              if(err)
              return done(error);
              return done(null,newUser);
            });
        });
    });
        }
      });
    });
  }
));

passport.use('local-login',new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
},
function(req,email,password,done){
  process.nextTick(function(){
    User.findOne({'email':email},function(err,user){
      if(err) return done(err);
      if(!user) return done(null,false,req.flash('loginMessage','There is no account with this id'));
      bcrypt.compare(password, user.password, function(err, res) {
        if(err)
        return done(err);
        if(!res) return done(null,false,req.flash('loginMessage','Incorrect email or password'));
        return done(null,user);
  });

});
  });
}
));

}
