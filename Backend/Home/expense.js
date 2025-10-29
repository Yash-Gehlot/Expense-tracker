const express = require("express");
const router = express.Router();
const db = require("../DB/db");

router.post("/addExpense", (req, res) => {
  const { amount, category, description } = req.body;
  const sql =
    "INSERT INTO Dailyexp (amount, category, description) VALUES (?, ?, ?)";
  db.query(sql, [amount, category, description], (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding expense" });
    res.status(200).json({ message: "Expense added successfully" });
  });
});

router.get("/getExpense", (req, res) => {
  const sql = "SELECT * FROM Dailyexp";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Error fetching expenses" });
    res.status(200).json(results);
  });
});

module.exports = router;
