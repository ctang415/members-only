var express = require('express');
var router = express.Router();
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

passport.use(
    new LocalStrategy({
        usernameField: 'email',
      }, async( username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (!user) {
          return done(null, false, {message: "Incorrect email" } );
        } else {
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        } else {
        return done(null, user);
    }
}
      } catch(err) {
        return done(err);
      };
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
/*
router.get('/', function (req, res, next) {
    res.render('login', user: req.user})
  })
*/
router.post("/login", passport.authenticate("local",  {
  successRedirect: "/",
  failureRedirect: "/",
})
);

router.get("/log-out", (req, res, next) => {
req.logout(function (err) {
  if (err) {
    return next(err);
  }
  res.redirect("/");
});
});



module.exports = router;
