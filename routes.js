module.exports=function(app,passport){
var User=require('./models/user');
var Post=require('./models/post');
  app.get('/',function(req,res){
    Post.find({}).lean().exec(function(err,posts){
      if(err)
      return done(err);
      res.render('index',{posts:posts});
    });

  });

  app.get('/login',function(req,res){
    res.render('login',{'message':req.flash('loginMessage')});
  });

  app.post('/login',passport.authenticate('local-login',{
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
  }));

  app.get('/signup',function(req,res){
      res.render('signup',{'message':req.flash('signupMessage')});
    });

  app.post('/signup',passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
  }));

  app.get('/new/post',isLoggedIn,function(req,res){
    res.render('newpost',{user:req.user});
  });

  app.post('/new/post',isLoggedIn,function(req,res){
      var newPost= new Post();
      var title=req.body.Title;
      var content=req.body.Content;
      var author=req.user._id;
      newPost.Title=title;
      newPost.Content=content;
      newPost.Author=author;
      newPost.Permalink=title.toLowerCase().trim().replace(/ /g,'-');
      newPost.save(function(err,post){
        if(err)
          return done(err);
          return res.redirect('/post/'+post.Permalink);
      });


  });

  app.get('/post/:param',function(req,res){
    Post.find({'Permalink':req.params.param},function(err,post){
      if(err)
      return done(err);
    res.render('single',{post:post});
  });
  });

  app.get('/edit/:slug',isLoggedIn,function(req,res){
    var postSlug=req.params.slug.trim();
    Post.find({'Permalink':postSlug}).lean().exec(function(err,post){
      if(err)
      done (err);
      if(!post) res.send("Invalid action");

      if(post[0].Author.trim()!=req.user._id)  return res.redirect('/');
      res.render('editpost',{post:post});
    });
  });

  app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
  });

  app.post('/saveprofile',function(req,res){
      User.findOne({'email':req.body.email},function(err,user){
        if(err)
        return done(err);
        user.Name =   req.body.Name;
        user.email  = req.body.email;
        user.Address= req.body.Address;
        user.City=    req.body.City;
        user.State=   req.body.State;
        user.Country= req.body.Country;
        user.ZIP=     req.body.ZIP;
        user.Phoneno= req.body.Phoneno;
        user.save(function(err,user){
          if(err)
          return done(err);
          res.render('editprofile',{user:user});
        })

      })
  });
app.post('/savepost',function(req,res){
    var postId=req.body.postid;
    Post.findOne({'_id':postId},function(err,post){
        if(err) return done(err);
        if(!post) return res.send ("Invalid operation");
        post.Title=req.body.Title;
        post.Content=req.body.Content;
        post.save(function(err,pst){
          if(err){ return done(err); }

          res.redirect('/post/'+pst.Permalink);
        });
    });
});
  app.get('/profile',isLoggedIn,function(req,res){
    res.render('editprofile',{user:req.user});
  })



}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
