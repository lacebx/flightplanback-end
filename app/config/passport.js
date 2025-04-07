const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models");
require("dotenv").config(); // Load environment variables
const User = db.student; 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8082/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

// Deserialize user from the session
passport.deserializeUser(async (user, done) => {
  try {
    const dbUser = await User.findByPk(user.id);
    done(null, dbUser);
  } catch (err) {
    done(err, null);
  }
});