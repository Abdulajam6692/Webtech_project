const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up MySQL connection
const con = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "assessment", // Assuming this is your database
  },
   {
     host: "10.12.3.93",
     user: "root",
     password: "",
     database: "assessment", // Assuming this is your database
   }
);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the assessment database!");
});

app.post("/addtimetable/:tableName", (req, res) => {
  const { tableName } = req.params;
  const { date, day, time, sub_name, E_type } = req.body;

  console.log("Received data:", req.body); // Log the received data

  if (!date || !day || !time || !sub_name || !E_type) {
    return res.status(400).send("All fields are required.");
  }

  const validTables = ["timetable", "5thsem", "3rdthsem"];
  if (!validTables.includes(tableName)) {
    return res.status(400).send("Invalid table name.");
  }

  const addTimetableSql = `INSERT INTO ${tableName} (date, day, time, sub_name, E_type) VALUES (?, ?, ?, ?, ?)`;

  con.query(addTimetableSql, [date, day, time, sub_name, E_type], (err) => {
    if (err) {
      console.error(`Error adding timetable to ${tableName}:`, err);
      return res.status(500).send("Error adding timetable.");
    }

    res.send(`<h1>Timetable entry added successfully to ${tableName}!</h1>`);
  });
});

// Endpoint to get timetable data dynamically
app.get("/gettimetable/:tableName", (req, res) => {
  const { tableName } = req.params;

  // Validate table name
  const validTables = ["timetable", "5thsem", "3rdthsem"];
  if (!validTables.includes(tableName)) {
    return res.status(400).send("Invalid table name.");
  }

  const getTimetableSql = `SELECT * FROM ${tableName}`;

  con.query(getTimetableSql, (err, result) => {
    if (err) {
      console.error(`Error fetching timetable from ${tableName}:`, err);
      return res.status(500).send("Error fetching timetable.");
    }

    res.json(result);
  });
});

// Add duty allocation (duty_allote table)
app.post("/addduty/duty_allote", (req, res) => {
  const { fac_id, fac_name, day, time, sub_name} = req.body;

   if (!fac_id || !fac_name || !day || !time || !sub_name) {
     return res.status(400).send("All fields are required.");
  }

  const addDutySql = `INSERT INTO duty_allote (fac_id, fac_name, day, time, sub_name) VALUES (?, ?, ?, ?, ?)`;

  con.query(addDutySql, [fac_id, fac_name, day, time, sub_name], (err) => {
    if (err) {
      console.error("Error allocating duty:", err);
      return res.status(500).send("Error allocating duty.");
    }

    res.json({ message: "Duty allocated successfully!" });
  });
});

// Endpoint to get all allocated duties
app.get("/getduty/duty_allote", (req, res) => {
  const getDutySql = "SELECT * FROM duty_allote";

  con.query(getDutySql, (err, result) => {
    if (err) {
      console.error("Error fetching duty allocations:", err);
      return res.status(500).send("Error fetching duty allocations.");
    }

    res.json(result);
  });
});

// Add bad allocation (bad_allote table)
app.post("/addduty/bad_allote", (req, res) => {
  const { fac_id, fac_name, day, time, sub_name } = req.body;

  if (!fac_id || !fac_name || !day || !time || !sub_name) {
    return res.status(400).send("All fields are required.");
  }

  const addBadDutySql = `INSERT INTO bad_allote (fac_id, fac_name, day, time, sub_name) VALUES (?, ?, ?, ?, ?)`;

  con.query(addBadDutySql, [fac_id, fac_name, day, time, sub_name], (err) => {
    if (err) {
      console.error("Error adding bad allocation:", err);
      return res.status(500).send("Error adding bad allocation.");
    }

    res.json({ message: "Bad allocation added successfully!" });
  });
});

// Endpoint to get all bad allocations
app.get("/getduty/bad_allote", (req, res) => {
  const getBadDutySql = "SELECT * FROM bad_allote";

  con.query(getBadDutySql, (err, result) => {
    if (err) {
      console.error("Error fetching bad allocations:", err);
      return res.status(500).send("Error fetching bad allocations.");
    }

    res.json(result);
  });
});

// Update duty allocation (duty_allote table)
app.put("/updateduty/duty_allote", (req, res) => {
  const { fac_id, fac_name, day, time, sub_name } = req.body;

  if (!fac_id || !fac_name || !day || !time || !sub_name) {
    return res.status(400).send("All fields are required.");
  }

  // SQL query to update the duty allocation based on fac_id
  const updateDutySql = `
    UPDATE duty_allote
    SET fac_name = ?, day = ?, time = ?, sub_name = ?
    WHERE fac_id = ?
  `;

  con.query(
    updateDutySql,
    [fac_name, day, time, sub_name, fac_id],
    (err, result) => {
      if (err) {
        console.error("Error updating duty allocation:", err);
        return res.status(500).send("Error updating duty allocation.");
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .send("Duty allocation not found for the provided faculty ID.");
      }

      res.json({ message: "Duty allocation updated successfully!" });
    }
  );
});

// Delete duty allocation from bad_allote (DELETE)
app.delete("/delete-badallote/:fac_id", (req, res) => {
  const { fac_id } = req.params;

  // SQL query to delete the record from bad_allote table
  const deleteBadDutySql = "DELETE FROM bad_allote WHERE fac_id = ?";

  con.query(deleteBadDutySql, [fac_id], (err, result) => {
    if (err) {
      console.error("Error deleting bad allocation:", err);
      return res.status(500).send("Error deleting bad allocation.");
    }

    if (result.affectedRows > 0) {
      res.send("Bad allocation deleted successfully!");
    } else {
      res.status(404).send("No record found with the given faculty ID.");
    }
  });
});

// Route to Fetch Unique Date-Time Values
app.get("/unique-values", (req, res) => {
  // Query to fetch unique date and time from all three tables
  const selectUniqueQuery = `
    SELECT DISTINCT DATE(date) AS date, time 
    FROM (
      SELECT date, time FROM 5thsem
      UNION
      SELECT date, time FROM 3rdthsem
      UNION
      SELECT date, time FROM timetable
    ) AS combined
    ORDER BY date, time;
  `;

  con.query(selectUniqueQuery, (err, uniqueResults) => {
    if (err) {
      console.error("Error retrieving unique values:", err);
      return res.status(500).send("Error retrieving unique values");
    }

    console.log("Unique Results:", uniqueResults);

    // For each unique date-time, fetch associated class data
    const promises = uniqueResults.map(({ date, time }) => {
      return new Promise((resolve, reject) => {
        const selectClassesQuery = "SELECT classname, classid FROM rooms";
        con.query(selectClassesQuery, (err, classes) => {
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

  con.query(createTableQuery, (createErr) => {
    if (createErr) {
      console.error("Error creating table:", createErr);
      return res.status(500).send("Error creating table");
    }

    con.query(insertQuery, [values], (insertErr) => {
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
// 9000
// Start the Server
app.listen(8000, () => {
  console.log(`Server is running on http://localhost:8000`);
});
