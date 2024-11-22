const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user.js');


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, 
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        console.error(err);
      }
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile']
      },
      async (token, tokenSecret, profile, done) => {
        const { id, displayName, emails, photos } = profile;
        try {
          let user = await User.findOne({ googleId: id });
          if (user) return done(null, user);

          // Generate a unique username based on the profile name or email
          const username = displayName.replace(/\s+/g, '') || `user_${id}`;
          user = await User.create({
            googleId: id,
            username,
            email: emails[0].value,
            avatar: photos[0].value,
          });

          return done(null, user);
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

   // Serialize user into session
  passport.serializeUser((user, done) => {
  done(null, user.id);
});
};


