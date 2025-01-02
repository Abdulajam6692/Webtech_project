import React, { useState, useEffect } from "react";
import axios from "axios";

const FifthSem = ({ goBack }) => {
  const [formData, setFormData] = useState({
    date: "",
    day: "Monday", // Set the default value to the first option
    time: "",
    sub_name: "Web Technology", // Set the default value to the first option
    E_type: "Theory", // Set the default value to the first option
  });

  const [timetable, setTimetable] = useState([]);

  // Fetch timetable data
  const fetchTimetable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/gettimetable/5thsem"
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
      await axios.post("http://localhost:8000/addtimetable/5thsem", formData);
      alert("Timetable added successfully!");
      fetchTimetable(); // Refresh the timetable list after adding a new entry
      setFormData({
        date: "",
        day: "Sunday", // Reset the field
        time: "",
        sub_name: "Web Technology", // Reset the field
        E_type: "Theory", // Reset the field
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
      <h2>5th Semester Timetable</h2>

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
          required
          style={{
            margin: "10px",
            width: "250px",
            height: "35px",
            backgroundColor: "black",
          }}
        >
          <option value="Web Technology">Web Technology</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="System Software">System Software</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Computer Networks-1">Computer Networks-1</option>
          <option value="Computational medicine">Computation Medicine</option>
          <option value="Computer Vision">Computer Vision</option>
          <option value="Cyber Security">Cyber Security</option>
        </select>
        <br />
        <label>Exam Type:</label>
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
      {/* 9000 */}
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

export default FifthSem;
