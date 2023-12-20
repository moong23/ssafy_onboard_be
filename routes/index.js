var express = require("express");
var router = express.Router();

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "203.255.186.16",
  user: "cielo",
  port: 20078,
  password: "Bong0915^^",
  database: "yoons",
});

connection.connect();

/* GET home page. */
router.get("/articles", function (req, res, next) {
  connection.query("SELECT * from db_data", (error, rows) => {
    if (error) throw error;
    res.send(JSON.stringify(rows));
  });
});

router.post("/filter", function (req, res, next) {
  const filterValues = req.body.filterList;

  // Sanitize and prepare the filter values for the SQL query
  const placeholders = filterValues.map(() => "?").join(", ");

  // Prepare the SQL query with placeholders for parameters
  const query = `SELECT * from db_data WHERE country IN (${placeholders})`;

  // Execute the query with the filter values as parameters
  connection.query(query, filterValues, (error, rows) => {
    if (error) throw error;
    res.send(JSON.stringify({ total: rows.length, rows: rows }));
  });
});

router.post("/filter/scrap", function (req, res, next) {
  const filterValues = req.body.filterList;

  // Sanitize and prepare the filter values for the SQL query
  const placeholders = filterValues.map(() => "?").join(", ");

  // Prepare the SQL query with placeholders for parameters
  const query = `SELECT * from db_data WHERE country IN (${placeholders}) AND saved = 1`;

  // Execute the query with the filter values as parameters
  connection.query(query, filterValues, (error, rows) => {
    if (error) throw error;
    res.send(JSON.stringify({ total: rows.length, rows: rows }));
  });
});

router.post("/update/:id", function (req, res, next) {
  const id = req.params.id;
  const memo = req.body.memo;

  const query = `UPDATE db_data SET memo = '${memo}' WHERE id = ${id}`;

  connection.query(query, [memo, id], (error, results) => {
    if (error) {
      res.status(500).send("error updating memo", error.message);
    }
    res.send("updated successfully");
  });
});

router.get("/scrap/:id", function (req, res, next) {
  const id = req.params.id;

  const query = `UPDATE db_data SET saved = 1 WHERE id = ${id}`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send("error updating saved", error.message);
    }
    res.send("updated successfully");
  });
});

router.get("/saved", function (req, res, next) {
  const query = `SELECT * from db_data WHERE saved = 1`;

  connection.query(query, (error, rows) => {
    if (error) throw error;
    res.send(JSON.stringify(rows));
  });
});

router.get("/unscrap/:id", function (req, res, next) {
  const id = req.params.id;

  const query = `UPDATE db_data SET saved = 0 WHERE id = ${id}`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send("error updating saved", error.message);
    }
    res.send("updated successfully");
  });
});

module.exports = router;
