const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const SECRET_KEY = "11223344";

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "management",
});

//Database connection check
db.connect((err) => {
  if (err) {
    console.log("Error to connect the database:", err);
    return;
  }
  console.log("Connected to MySQL Database");
});

//Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const currentTime = new Date();
  // const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  const insert_reg =
    "INSERT INTO users (name, email, password, last_login_time) VALUES (?, ?, ?, ?)";
  db.query(
    insert_reg,
    [name, email, hashedPassword, currentTime],
    (err, result) => {
      if (err) {
        return res.status(400).send("This user is already exists");
      }
      res.send(" The user is registered");
    }
  );
});

//Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const login_sql = "SELECT * FROM users WHERE email = ?";
  db.query(login_sql, [email], (err, results) => {
    if (err || results.length == 0) {
      return res.status(400).send("User not found");
    }

    const user = results[0];

    if (user.status === "blocked") {
      return res.status(403).send("You are blocked. Sorry you cannot enter..");
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid password..Try again..");
    }

    // token  created
    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const currentTime = new Date();

    const update_query = "UPDATE users SET last_login_time = ? WHERE email = ?";
    db.query(update_query, [currentTime, email], (err, result) => {
      if (err) {
        return res.status(500).send("Error registering user: " + err.message);
      }
      res.json({ token });
    });
  });
});

// Home
app.get("/homepage", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    res.json({ name: verified.name });
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
});

//For table
app.get("/table", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

//delete the selected items
app.post("/deleteUsers", (req, res) => {
  const userids = req.body.userids;

  const deletequery = "DELETE FROM users WHERE id IN (?)";

  db.query(deletequery, [userids], (err, result) => {
    if (err) {
      console.error("Error deleting users:", err);
      return res.status(501).json({ message: "Error deleting users" });
    }

    res.json(result);
  });
});

//Block the selected items
app.post("/blockUsers", (req, res) => {
  const userids = req.body.userids;

  const updateQuery = "UPDATE users SET status = ? WHERE id IN (?)";

  db.query(updateQuery, ["blocked", userids], (err, result) => {
    if (err) {
      console.error("Error Blocking users:", err);
      return res.status(502).json({ message: "Error Blocking users" });
    }

    res.json(result);
  });
});

//Active the selected items
app.post("/activeUsers", (req, res) => {
  const userids = req.body.userids;

  const updateQuery = "UPDATE users SET status = ? WHERE id IN (?)";

  db.query(updateQuery, ["active", userids], (err, result) => {
    if (err) {
      console.error("Error Activating users:", err);
      return res.status(503).json({ message: "Error Activating users" });
    }

    res.json(result);
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port: 5000");
});
