const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/user.model");

const jwt = require("jsonwebtoken");

const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

router.post(
  "/register",

  body("name").isLength({ min: 2 }).withMessage("Please enter the name"),
  body("email").isEmail().withMessage("Please enter the vaild email address"),
  body("password")
    .isLength({ min: 4, max: 20 })
    .withMessage("The password should be the min length 4 and max length 20"),

  async (req, res) => {
    let errors = validationResult(req);

    let finalErrors = null;
    if (!errors.isEmpty()) {
      finalErrors = errors.array().map((error) => {
        return {
          param: error.param,
          msg: error.msg,
        };
      });

      return res.status(400).send({ error: finalErrors });
    }
    let user;
    try {
      user = await User.findOne({ email: req.body.email }).lean().exec();

      if (user)
        return res.status(400).send({ message: "Email already exists" });

      user = await User.create(req.body);

      const token = newToken(user);

      return res.status(201).send({ user, token });
    } catch (e) {
      return res.status(500).send({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/login",

  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 4, max: 20 })
    .withMessage("Invalid password"),

  async (req, res) => {
    let errors = validationResult(req);
    let finalErrors = null;

    if (!errors.isEmpty()) {
      finalErrors = errors.array().map((error) => {
        return { param: error.param, msg: error.msg };
      });

      return res.status(400).send({ errors: finalErrors });
    }

    let user;

    try {
      user = await User.findOne({ email: req.body.email }).exec();

      if (!user) return res.status(400).send({ message: "User is not found" });

      let match = user.checkPassword(req.body.password);
      if (!match) return res.status(400).send({ message: "Invalid password" });

      const token = newToken(user);

      return res.status(200).send({ user, token });
    } catch (e) {
      return res.status(500).send({ message: "Something went wrong" });
    }
  }
);

module.exports = router;
