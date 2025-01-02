// Import necessary modules
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

// Initialize express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up MySQL connection
const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "assessment",
});

// Connect to the database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the assessment database!");
});

// Define the root route to serve the form
app.get("/", (req, res) => {
  const html = `
    <div style="text-align: center; font-family: Arial;">
      <h1>In-Semester Time Table</h1>
      <h2>Admin: Create Timetable</h2>
      <form action="/addtimetable" method="POST" style="margin: auto; width: 50%;">
        <label>Date:</label>
        <input type="date" name="date" required style="margin: 10px;"><br>
        <label>Day:</label>
        <input type="text" name="day" required style="margin: 10px;"><br>
        <label>Time:</label>
        <input type="text" name="time" required style="margin: 10px;"><br>
        <label>Subject Name:</label>
        <input type="text" name="sub_name" required style="margin: 10px;"><br>
        <button type="submit" style="margin: 20px;">Add Timetable</button>
      </form>
    </div>
  `;
  res.send(html);
});

// Define the POST route for adding timetable
app.post("/addtimetable", (req, res) => {
  const { date, day, time, sub_name } = req.body;

  if (!date || !day || !time || !sub_name) {
    return res.status(400).send("All fields are required.");
  }

  const addTimetableSql = `INSERT INTO timetable (date, day, time, sub_name) VALUES (?, ?, ?, ?)`;

  con.query(addTimetableSql, [date, day, time, sub_name], (err) => {
    if (err) {
      console.error("Error adding timetable:", err);
      return res.status(500).send("Error adding timetable.");
    }

    res.send("<h1>Timetable entry added successfully!</h1>");
  });
});

// Start the server
app.listen(8000, function () {
  console.log("Server is running on http://localhost:8000");
});

// 9000
