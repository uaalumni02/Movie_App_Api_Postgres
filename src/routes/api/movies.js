const express = require("express");
const router = express.Router();
const db = require("../../database/index");

router.get("/", function (req, res) {
  db.select()
    .from("movies")
    .orderBy("id")
    .then(function (data) {
      res.send(data);
    });
});

router.post("/", function (req, res) {
  db.insert(req.body)
    .returning("*")
    .into("movies")
    .then(function (data) {
      res.send(data);
    });
});

router.patch("/:id", function (req, res) {
  db("movies")
    .where({ id: req.params.id })
    .update(req.body)
    .returning("*")
    .then(function (data) {
      res.send(data);
    });
});

router.delete("/:id", function (req, res) {
  db("movies")
    .where({ id: req.params.id })
    .del()
    .then(function () {
      res.json({ success: true });
    });
});

router.get("/:id", function (req, res) {
  db("movies")
    .where({ id: req.params.id })
    .select()
    .then(function (data) {
      res.send(data);
    });
});

module.exports = router;
