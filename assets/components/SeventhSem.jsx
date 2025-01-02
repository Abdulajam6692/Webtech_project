import React, { useState, useEffect } from "react";
import axios from "axios";

const SeventhSem = ({ goBack }) => {
  const [formData, setFormData] = useState({
    date: "",
    day: "Monday", // Set the default value
    time: "",
    sub_name: "Constitution of India", // Default value
    E_type: "Theory", // Default value
  });

  const [timetable, setTimetable] = useState([]);

  // Fetch timetable data
  const fetchTimetable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/gettimetable/timetable"
      );
      setTimetable(response.data);
    } catch (error) {
      console.error(
        "Error fetching timetable:",
        error.response || error.message
      );
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
      await axios.post(
        "http://localhost:8000/addtimetable/timetable",
        formData
      );
      alert("Timetable added successfully!");
      fetchTimetable(); // Refresh timetable after adding a new entry
      setFormData({
        date: "",
        day: "Sunday", // Reset to default
        time: "",
        sub_name: "Constitution of India", // Reset to default
        E_type: "Theory", // Reset to default
      });
    } catch (error) {
      console.error("Error adding timetable:", error.response || error.message);
      alert("Error adding timetable.");
    }
  };

  // Fetch timetable when the component loads
  useEffect(() => {
    console.log("Fetching timetable...");
    fetchTimetable();
  }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h2>7th Semester Timetable</h2>

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
            color: "white",
          }}
        >
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
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
          style={{
            margin: "10px",
            width: "250px",
            height: "35px",
            backgroundColor: "black",
          }}
        >
          <option value="Constitution of India">Constitution of India</option>
          <option value="Big data and analytics">Big data and analytics</option>
          <option value="Information Security">Information Security</option>
          <option value="Generative AI">Generative AI</option>
          <option value="Cyber Security">Cyber Security</option>
        </select>
        <br />
        <label>Exam Type:</label>
        <select
          name="E_type"
          value={formData.E_type}
          onChange={handleChange}
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
                <th>Exam Type</th>
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

export default SeventhSem;

// 9000
