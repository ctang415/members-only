var express = require('express');
var router = express.Router();
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      }, async( username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        // comparing the non-hashed password with the hashed DB password
        const match = await bcrypt.compare(password, user.password)
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        };
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        };
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );

router.get('/login', function (req, res, next) {
    res.render('login', {title: "Log in",  user: req.user})
  })

router.post("/login", passport.authenticate("local",  {
  successRedirect: "/login",
  failureRedirect: "/login", failureMessage: true
})
);

// creates a cookie stored in user's browser to make sure user is logged in
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });

router.get("/log-out", (req, res, next) => {
req.logout(function (err) {
  if (err) {
    return next(err);
  }
  res.redirect("/");
});
});



module.exports = router;
