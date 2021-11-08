var GoogleStrategy = require("passport-google-oauth2").Strategy;
var passport = require("passport");
const User = require("../models/user.model");
const { v4: uuidV4 } = require("uuid");
const jwt = require("jsonwebtoken");

const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

// const {newToken} = require("../controllers/auth.controller");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_KEY,
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://**www**.googleapis.com/oauth2/v3/userinfo",

      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const email = profile?._json?.email;

      let user;
      try {
        user = await User.findOne({ email }).lean().exec();
        if (!user) {
          user = await User.create({ email: email, password: uuidV4() });
        }
        const token = newToken(user);
        return done(null, { user, token });
      } catch (err) {
        console.log("err", err);
      }
    }
  )
);

module.exports = passport;
