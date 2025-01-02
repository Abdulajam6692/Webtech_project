import React, { useState, useEffect } from "react";
import axios from "axios";

const DutyAllote = ({ goBack }) => {
  const [formData, setFormData] = useState({
    fac_id: "",
    fac_name: "",
    day: "",
    time: "",
    sub_name: "",
  });

  const [dutyList, setDutyList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for handling errors

  // Fetch duty allocation data
  const fetchDutyList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/getduty/duty_allote"
      );
      setDutyList(response.data);
    } catch (error) {
      console.error("Error fetching duty list:", error);
      setErrorMessage("Error fetching duty list. Please try again.");
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
      await axios.post("http://localhost:8000/addduty/duty_allote", formData);
      alert("Duty allocated successfully!");
      fetchDutyList(); // Refresh duty list
      setFormData({
        fac_id: "",
        fac_name: "",
        day: "",
        time: "",
        sub_name: "",
      });
    } catch (error) {
      console.error("Error allocating duty:", error);
      setErrorMessage("Error allocating duty. Please try again.");
    }
  };

  // Fetch duty list when the component loads
  useEffect(() => {
    fetchDutyList();
  }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h2>Allocate Faculty Duty</h2>

      {/* Display Error Message if any */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Duty Allocation Form */}
      <form onSubmit={handleSubmit} style={{ margin: "auto", width: "50%" }}>
        <label>Faculty ID:</label>
        <input
          type="text"
          name="fac_id"
          value={formData.fac_id}
          onChange={handleChange}
          required
          style={{ margin: "10px" }}
        />
        <br />
        <label>Faculty Name:</label>
        <input
          type="text"
          name="fac_name"
          value={formData.fac_name}
          onChange={handleChange}
          required
          style={{ margin: "10px" }}
        />
        <br />
        <label>Day:</label>
        <input
          type="text"
          name="day"
          value={formData.day}
          onChange={handleChange}
          required
          style={{ margin: "10px" }}
        />
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
        <input
          type="text"
          name="sub_name"
          value={formData.sub_name}
          onChange={handleChange}
          required
          style={{ margin: "10px" }}
        />
        <br />
        <button type="submit" style={{ margin: "20px" }}>
          Allocate Duty
        </button>
      </form>

      {/* Display Allocated Duties */}
      {dutyList.length > 0 && (
        <div>
          <h3>Allocated Duties:</h3>
          <table
            style={{ margin: "auto", width: "80%", border: "1px solid black" }}
          >
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Faculty Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {dutyList.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.fac_id}</td>
                  <td>{entry.fac_name}</td>
                  <td>{entry.day}</td>
                  <td>{entry.time}</td>
                  <td>{entry.sub_name}</td>
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

export default DutyAllote;

// 9000
