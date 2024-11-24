const express = require('express');
const router = express.Router();
const passport = require('passport');
let userModel = require('../model/User');
let User = userModel.User;

/* GET index page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET home page. */
router.get('/home', function (req, res, next) {
  res.render('index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
  });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  if (!req.user) {
    res.render('auth/login', {
      title: 'Login',
      message: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  } else {
    return res.redirect('/');
  }
});

/* POST login route. */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/surveyslist', // redirecting
  failureRedirect: '/login',      // redirect back to login page on failure
  failureFlash: true              // display message on failure
}));


/* GET logout route */
router.get('/logout', function (req, res, next) {
  req.logout(function(err) { // Passport's logout method
    if (err) {
      console.error('Logout Error:', err);
      return next(err); // Pass error 
    }
    res.redirect('/login'); // Redirect to the login page after logging out
  });
});

/* GET register page. */
router.get('/register', function (req, res, next) {
  if (!req.user) {
    res.render('auth/register', {
      title: 'Register',
      message: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  } else {
    return res.redirect('/');
  }
});

/* POST register page. */
router.post('/register', function (req, res, next) {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Inserting the new User");
      if (err.name === "UserExistError") {
        req.flash('registerMessage', 'Registration Error: User already exists');
      } else {
        req.flash('registerMessage', 'Registration Error: ' + err.message);
      }
      return res.render('auth/register', {
        title: 'Register',
        message: req.flash('registerMessage'),
        displayName: req.user ? req.user.displayName : ''
      });
    } else {
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/surveyslist');
      });
    }
  });
});

module.exports = router;
