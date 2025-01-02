import mysql from "mysql2/promise";

// Create a connection to the database
export const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "assessment", // Specify the database name here
});
