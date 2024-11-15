var express = require('express');
var router = express.Router();
const passport = require('passport');
const DB = require('../config/db');
let userModel = require('../model/User');
let User = userModel.User;


/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' });
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Home' });
});
router.get('/login', function(req,res,next){
  if(!req.user)
  {
    req.render('auth/login',
      {
        title:'Login',
        message:req.flash(loginMessage),
        displayName: req.user ? req.user.displayName:''
      }
    )
  }
  else
  {
    return res.redirect('/')
  }
})
router.post('/login', function(req,res,next){
  passport.authenticate('local', (err,user,info)=>{
    if(err)
    {
      return next(err)
    }
    if (!user)
    {
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }
    req.login(user,(err)=>{
      if(err)
      {
        return next(err)
      }
      return res.redirect('/workoutlist')
    })
  })(req.res.next)
})
router.get('/register',function(req,res,next){
  if(!req.user)
    {
      req.render('auth/register',
        {
          title:'Register',
          message:req.flash(registerMessage),
          displayName: req.user ? req.user.displayName:''
        }
      )
    }
    else
    {
      return res.redirect('/')
    }
})
router.post('/register',function(req,res,next){
  let mewUser = new User({
    username:req.body.username,
    //passward:req.body.passward,
    email:req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser,req.body.password,(err) =>{
    if(err)
    {
      console.log("Error:Inserting the new User");
      if (err.name=="UserExistError")
      {
        req.flash('registerMessage','Registration Error: User already exists')
      }
      return res.render('auth/register',{
        title:'Register',
        message:req.flash('registerMessage'),
        displayName: req.user?req.user.displayName:''
      })
    }
    else
    {
      return passport.authenticate('local')(req,res,() =>{
        res.redirect('/workoutlist')
      })
    }
  })
})
router.get('/logout', function(req,res,next){
  req.logOut(function(err){
    if(err)
    {
      return next (err);
    }
  })
  res.redirect('/')
})
module.exports = router;
