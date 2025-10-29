const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const exprenseRoute = require("../Home/expense");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/expense", exprenseRoute);

app.post("/user/signup", (req, res) => {
  const { name, email, password } = req.body;

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (results.length > 0) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err)
        return res.status(500).json({ message: "Error hashing password" });

      const insertQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Failed to add user" });
        }
        return res.status(201).json({ message: "User added successfully" });
      });
    });
  });
});

app.post("/user/login", (req, res) => {
  const { email, password } = req.body;

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "user not found in the database" });
    }
    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error verifing password" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      res.status(200).json({
        message: "user logged in successfully",
        success: true,
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
