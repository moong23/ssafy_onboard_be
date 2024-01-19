var dotenv = require("dotenv");
var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

dotenv.config();

// const mysql = require("mysql2");

var user = mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

var User = mongoose.model("User", user);

router.post("/auth/register", async function (req, res) {
  console.log("register");
  console.log(req.body);
  const { name, email, password } = req.body;
  // Assuming this is inside an async function
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      console.log("User already exists");
      return res.status(403).send("User already exists");
    }

    const newUser = new User({ name: name, email: email, password: password });
    const savedUser = await newUser.save();
    console.log("User created");
    return res.status(200).send("User created");
  } catch (err) {
    console.log("Error occurred", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post(`/auth/login`, async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      console.log("User exists");
      return res.status(200).send("User exists");
    }
    console.log("User does not exist");
    return res.status(403).send("User does not exist");
  } catch (err) {
    console.log("Error occurred", err);
    return res.status(500).send("Internal Server Error");
  }
});

router.get(`/isUser`, async function (req, res) {
  const { email } = req.query;
  console.log(email);
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      console.log("User exists");
      return res.status(200).send("User exists");
    } else {
      console.log("User does not exist");
      return res.status(404).send("User does not exist");
    }
  } catch (err) {
    console.log("Error occurred", err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
