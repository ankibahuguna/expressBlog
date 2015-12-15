var express = require('express');
var app =	express();
var port=process.env.PORT||3000;
var bodyParser = require('body-parser');
var methodOVerride=require('method-override');
var cookieParser=require('cookie-parser');
var passport=require('passport');
var session=require('express-session');
var flash=require('connect-flash');
var mongoose=require('mongoose');
var morgan=require('morgan');
var configDb=require('./config/db');
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

mongoose.connect(configDb.url);

require('./config/passport')(passport);
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(methodOVerride());
app.use(cookieParser());
app.use(bodyParser.json(true));
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){

  app.locals.userLoggedIn = function() {

     return req.isAuthenticated();
  };
  app.locals.canEdit=function(){
    
    if(req.isAuthenticated()){

      return req.user._id;
    }
    else {
      return false;
    }
  };

  next();
});
app.use(session({
  secret:"hoskfajkadf895349vnb48yt53491",
  resave:true,
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app,passport);

app.listen(port,function(){
  console.log("Server started at port "+port)
});
