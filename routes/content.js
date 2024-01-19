var dotenv = require("dotenv");
var express = require("express");
var ContentRouter = express.Router();
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

dotenv.config();

// const mysql = require("mysql2");

var content = mongoose.Schema({
  title: String,
  thumbnail: String,
  content: String,
  date: String,
  writer: String,
  id: Number,
});
content.plugin(AutoIncrement, { inc_field: "id" });
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
    return res.status(500).send("Internal Server Error");
  }
});

ContentRouter.get("/", async function (req, res) {
  try {
    const content = await Content.find();
    console.log(content);
    return res.status(200).send(content);
  } catch (err) {
    console.log("Error occurred", err);
    res.status(500).send("Internal Server Error");
  }
});

ContentRouter.get("/:id", async function (req, res) {
  console.log(req.params.id);
  try {
    const contentWithID = await Content.findOne({ id: req.params.id });
    console.log(contentWithID);
    return res.status(200).send(contentWithID);
  } catch (err) {
    console.log("Error occurred", err);
    return res.status(500).send("Internal Server Error");
  }
});

ContentRouter.get("/filter/:writer", async function (req, res) {
  try {
    const content = await Content.find({ writer: req.params.writer });
    // console.log(content);
    if (content.length == 0) return res.status(204).send("Not Content Found");

    return res.status(200).send(content);
  } catch (err) {
    console.log("Error occurred", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = ContentRouter;
