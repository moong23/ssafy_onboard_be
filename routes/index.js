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
    res.status(200).send("User created");
  } catch (err) {
    console.log("Error occurred", err);
    res.status(500).send("Internal Server Error");
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
    res.status(500).send("Internal Server Error");
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
    }
    console.log("User does not exist");
    return res.status(404).send("User does not exist");
  } catch (err) {
    console.log("Error occurred", err);
    res.status(500).send("Internal Server Error");
  }
});

// /* GET home page. */
// router.get("/articles", function (req, res, next) {
//   connection.query("SELECT * from db_data", (error, rows) => {
//     if (error) throw error;
//     res.send(JSON.stringify(rows));
//   });
// });

// router.post("/filter", function (req, res, next) {
//   const filterValues = req.body.filterList;

//   // Sanitize and prepare the filter values for the SQL query
//   const placeholders = filterValues.map(() => "?").join(", ");

//   // Prepare the SQL query with placeholders for parameters
//   const query = `SELECT * from db_data WHERE country IN (${placeholders})`;

//   // Execute the query with the filter values as parameters
//   connection.query(query, filterValues, (error, rows) => {
//     if (error) throw error;
//     res.send(JSON.stringify({ total: rows.length, rows: rows }));
//   });
// });

// router.post("/filter/scrap", function (req, res, next) {
//   const filterValues = req.body.filterList;

//   // Sanitize and prepare the filter values for the SQL query
//   const placeholders = filterValues.map(() => "?").join(", ");

//   // Prepare the SQL query with placeholders for parameters
//   const query = `SELECT * from db_data WHERE country IN (${placeholders}) AND saved = 1`;

//   // Execute the query with the filter values as parameters
//   connection.query(query, filterValues, (error, rows) => {
//     if (error) throw error;
//     res.send(JSON.stringify({ total: rows.length, rows: rows }));
//   });
// });

// router.post("/update/:id", function (req, res, next) {
//   const id = req.params.id;
//   const memo = req.body.memo;

//   const query = `UPDATE db_data SET memo = '${memo}' WHERE id = ${id}`;

//   connection.query(query, [memo, id], (error, results) => {
//     if (error) {
//       res.status(500).send("error updating memo", error.message);
//     }
//     res.send("updated successfully");
//   });
// });

// router.get("/scrap/:id", function (req, res, next) {
//   const id = req.params.id;

//   const query = `UPDATE db_data SET saved = 1 WHERE id = ${id}`;

//   connection.query(query, [id], (error, results) => {
//     if (error) {
//       res.status(500).send("error updating saved", error.message);
//     }
//     res.send("updated successfully");
//   });
// });

// router.get("/saved", function (req, res, next) {
//   const query = `SELECT * from db_data WHERE saved = 1`;

//   connection.query(query, (error, rows) => {
//     if (error) throw error;
//     res.send(JSON.stringify(rows));
//   });
// });

// router.get("/unscrap/:id", function (req, res, next) {
//   const id = req.params.id;

//   const query = `UPDATE db_data SET saved = 0 WHERE id = ${id}`;

//   connection.query(query, [id], (error, results) => {
//     if (error) {
//       res.status(500).send("error updating saved", error.message);
//     }
//     res.send("updated successfully");
//   });
// });

module.exports = router;
