var dotenv = require("dotenv");
var express = require("express");
var ContentRouter = express.Router();
const mongoose = require("mongoose");

dotenv.config();

// const mysql = require("mysql2");

var content = mongoose.Schema({
  title: String,
  thumbnail: String,
  content: String,
  date: String,
  writer: String,
});

var Content = mongoose.model("Content", content);

ContentRouter.post("/create", async function (req, res) {
  console.log("create");
  console.log(req.body);

  const { title, thumbnail, content, date, writer } = req.body;
  try {
    const newContent = new Content({
      title: title,
      thumbnail: thumbnail,
      content: content,
      date: date,
      writer: writer,
    });
    const savedContent = await newContent.save();
    console.log("Content created");
    res.status(200).send("Content created");
  } catch (err) {
    console.log("Error occurred", err);
    res.status(500).send("Internal Server Error");
  }
});

ContentRouter.get("/", async function (req, res) {
  try {
    const content = await Content.find();
    console.log(content);
    res.status(200).send(content);
  } catch (err) {
    console.log("Error occurred", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = ContentRouter;
