import React, { useState, useEffect } from "react";
import axios from "axios";

const ThirdSem = ({ goBack }) => {
  const [formData, setFormData] = useState({
    date: "",
    day: "Monday", // Set default to first option
    time: "",
    sub_name: "Data structure and algorithm", // Set default to first option
    E_type: "Theory", // Set default to first option
  });

  const [timetable, setTimetable] = useState([]);

  // Fetch timetable data
  const fetchTimetable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/gettimetable/3rdthsem"
      );
      setTimetable(response.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/addtimetable/3rdthsem", formData);
      alert("Timetable added successfully!");
      fetchTimetable(); // Refresh the timetable list after adding a new entry
      setFormData({
        date: "",
        day: "Monday", // Reset to default
        time: "",
        sub_name: "Data structure and algorithm", // Reset subject name
        E_type: "Theory", // Reset event type
      });
    } catch (error) {
      console.error("Error adding timetable:", error);
      alert("Error adding timetable.");
    }
  };

  // Fetch timetable when the component loads
  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h2>3rd Semester Timetable</h2>

      {/* Add Timetable Form */}
      <form onSubmit={handleSubmit} style={{ margin: "auto", width: "50%" }}>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ margin: "10px" }}
        />
        <br />
        <label>Day:</label>
        <select
          name="day"
          value={formData.day}
          onChange={handleChange}
          required
          style={{
            margin: "10px",
            width: "250px",
            height: "35px",
            backgroundColor: "black",
          }}
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <br />
        <label>Time:</label>
        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          style={{ margin: "10px" }}
        />
        <br />
        <label>Subject Name:</label>
        <select
          name="sub_name"
          value={formData.sub_name}
          onChange={handleChange}
          required
          style={{
            margin: "10px",
            width: "250px",
            height: "35px",
            backgroundColor: "black",
          }}
        >
          <option value="Data structure and algorithm">
            Data structure and algorithm
          </option>
          <option value="Database management system">
            Database management system
          </option>
          <option value="Computer organisation and architecture">
            Computer organisation and architecture
          </option>
          <option value="Discrete mathematics structure">
            Discrete mathematics structure
          </option>
          <option value="Graph theory and Linear algebra">
            Graph theory and Linear algebra
          </option>
        </select>
        <br />
        <label>Event Type:</label>
        <select
          name="E_type"
          value={formData.E_type}
          onChange={handleChange}
          required
          style={{
            margin: "10px",
            width: "250px",
            height: "35px",
            backgroundColor: "black",
          }}
        >
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>
        <br />
        <button type="submit" style={{ margin: "20px" }}>
          Add Timetable
        </button>
      </form>

      {/* Display Timetable */}
      {timetable.length > 0 && (
        <div>
          <h3>Timetable:</h3>
          <table
            style={{ margin: "auto", width: "80%", border: "1px solid black" }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Event Type</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.day}</td>
                  <td>{entry.time}</td>
                  <td>{entry.sub_name}</td>
                  <td>{entry.E_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Back Button */}
      <button onClick={goBack} style={{ margin: "20px" }}>
        Back to Admin Console
      </button>
    </div>
  );
};

export default ThirdSem;

// 9000
