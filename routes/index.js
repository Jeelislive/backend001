var express = require('express');
var router = express.Router();
var userModel = require('./users');
const passport = require('passport');

var localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index'); // Render the index page
});

router.get('/login', function (req, res) {
  res.render('login', { message: req.flash('error') }); // Render the login page with error messages if any
});

router.get('/profile', function (req, res) {
  res.render('profile');
});

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return next(err); 
    }
    res.redirect('/login'); 
  });
});

router.post('/register', function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret,
  });

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      });
    })
    .catch(function (err) {
      // Handle registration errors
      console.error("Registration error:", err);
      res.redirect('/login'); // Redirect to login page on error
    });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login", // Redirect to login page on failure
  failureFlash: true
}));


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
