const express = require("express");
const app = express();

app.use(express.json());

const userController = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");
const passport = require("./configs/passport");

app.use(passport.initialize());

passport.serializeUser(function ({ user, token }, done) {
  done(null, { user, token });
});

passport.deserializeUser(function ({ user, token }, done) {
  done(err, { user, token });
});

app.get("/auth/google/failure", function (req, res) {
  return res.send("Something went wrong");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  function (req, res) {
    const { user, token } = req.user;
    return res.status(200).send({ user, token });
  }
);

app.use("/user", userController);
app.use("/product", productController);

module.exports = app;
