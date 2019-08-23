const passport = require('passport');
const user = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    user.findOne({ 'googleId': profile.id }, 
      function(err, user) {
        if(err) return cb(err);
        if(user) {
        return cb(null, user);
          } else {
            // create a new user
            const newUser = new User({ 
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id
          });
          newUser.save(function(err) {
            if(err) return cb(err);
            return cb(null, newUser);
          });
        }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user);
  })
});