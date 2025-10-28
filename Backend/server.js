const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yash gehlot",
  database: "expense",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database: expense");
  }
});

app.post("/user/signup", (req, res) => {
  const { name, email, password } = req.body;

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (results.length > 0) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const insertQuery =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add user" });
      }
      return res.status(201).json({ message: "User added successfully" });
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
