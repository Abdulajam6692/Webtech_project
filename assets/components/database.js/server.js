import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8000;

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  credentials: true, // Include credentials if needed
};

app.use(cors(corsOptions)); // Apply CORS middleware before other routes

// Other middleware and routes...

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost", // Replace with your DB host
  user: "root", // Replace with your DB user
  password: "", // Replace with your DB password
  database: "assessment", // Replace with your DB name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application if DB connection fails
  }
  console.log("Connected to the database");
});

// Route to Fetch Unique Date-Time Values
app.get("/unique-values", (req, res) => {
  const selectUniqueQuery =
    "SELECT DISTINCT DATE(date) AS date, time FROM date_time_table ORDER BY date, time";
  db.query(selectUniqueQuery, (err, uniqueResults) => {
    if (err) {
      console.error("Error retrieving unique values:", err);
      return res.status(500).send("Error retrieving unique values");
    }

    // For each unique date-time, fetch associated class data
    const promises = uniqueResults.map(({ date, time }) => {
      return new Promise((resolve, reject) => {
        const selectClassesQuery = "SELECT classname, classid FROM rooms";
        db.query(selectClassesQuery, (err, classes) => {
          if (err) reject(err);
          resolve({ date, time, classes });
        });
      });
    });

    Promise.all(promises)
      .then((data) => res.json(data))
      .catch((err) => {
        console.error("Error fetching classes:", err);
        res.status(500).send("Error fetching classes");
      });
  });
});

const formatDate = (date) => {
  // Extract the first 10 characters and remove dashes
  date =
    date.substring(0, 10).replace(/-/g, "") +
    date.substring(10).replace(/[^\w\s\T]/g, "_");
  return date.split("T")[0];
};

function formatagain(tableName) {
  // Take first 11 characters and last 6 characters
  const firstPart = tableName.slice(0, 11);
  const lastPart = tableName.slice(-6);

  // Remove all commas, plus signs, slashes
  const formattedFirstPart = firstPart.replace(/[,+/]/g, "");
  const formattedLastPart = lastPart.replace(/[,+/]/g, "");

  // Replace all colons with underscores
  const finalFirstPart = formattedFirstPart.replace(/:/g, "_");
  const finalLastPart = formattedLastPart.replace(/:/g, "_");

  // Combine the first 11 and last 6 parts
  console.log("hey" + finalFirstPart + finalLastPart);
  return finalFirstPart + finalLastPart;
}

app.post("/submit-available-classes/:date/:time", (req, res) => {
  const { date, time } = req.params;
  const { classes } = req.body;

  if (!Array.isArray(classes) || classes.length === 0) {
    return res.status(400).send("No classes selected");
  }

  var formattedDate = formatDate(date); // Get formatted date part
  let tableName = `${formattedDate}` + `${time}`; // Change to `let`

  tableName = formatagain(tableName); // Now this reassignment is allowed

  tableName = `available_classes_` + tableName;
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        classname VARCHAR(255),
        classid INT,
        capacity INT,
        available BOOLEAN
      );
    `;

  const values = classes.map(({ className, classId }) => [
    className,
    classId,
    30,
    true,
  ]);

  const insertQuery = `
      INSERT INTO ${tableName} (classname, classid, capacity, available)
      VALUES ?
    `;

  db.query(createTableQuery, (createErr) => {
    if (createErr) {
      console.error("Error creating table:", createErr);
      return res.status(500).send("Error creating table");
    }

    db.query(insertQuery, [values], (insertErr) => {
      if (insertErr) {
        console.error("Error inserting classes:", insertErr);
        return res.status(500).send("Error inserting classes");
      }

      res.send("Classes submitted successfully");
    });
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).send("An unexpected error occurred");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 9000
