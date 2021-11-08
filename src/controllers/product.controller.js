const express = require("express");

const router = express.Router();

const Product = require("../models/product.model");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.get("/", authenticate, async (req, res) => {
  const post = await Product.find().lean().exec();

  const user = req.user;

  return res.status(200).send({ post, user });
});

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);

  // const user = req.user;

  return res.status(200).send({ product });
});

router.patch(
  "/update/:id",
  authenticate,
  authorize(["seller", "admin"]),
  async (req, res) => {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(201).send({ item });
  }
);

router.delete(
  "/delete/:id",
  authenticate,
  authorize(["seller", "admin"]),
  async (req, res) => {
    const item = await Product.findByIdAndDelete(req.params.id).exec();

    return res.status(200).send({ message: "The product is deleted", item });
  }
);

module.exports = router;
