import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./faculty.css";

function Faculty() {
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [dutyAllocations, setDutyAllocations] = useState([]);
  const [badAllocations, setBadAllocations] = useState([]);
  const [error, setError] = useState("");
  const [badAlloteData, setBadAlloteData] = useState({
    fac_id: "",
    fac_name: "",
    day: "",
    time: "",
    sub_name: "",
  });

  // Logout function
  const handleLogout = () => {
    navigate("/");
  };

  // Fetch timetable for a specific semester
  const fetchTimetable = async (semester) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/gettimetable/${semester}`
      );
      setTimetable(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setError("Failed to fetch timetable. Please try again.");
    }
  };

  // Fetch duty allocations
  const fetchDutyAllocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/getduty/duty_allote"
      );
      setDutyAllocations(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching duty allocations:", err);
      setError("Failed to fetch duty allocations. Please try again.");
    }
  };

  // Fetch bad allocations
  const fetchBadAllocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/getduty/bad_allote"
      );
      setBadAllocations(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching bad allocations:", err);
      setError("Failed to fetch bad allocations. Please try again.");
    }
  };

  // Handle form input changes for bad_allote
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBadAlloteData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit bad_allote data
  const handleAddBadAllocation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/addduty/bad_allote",
        badAlloteData
      );
      setError("");
      alert("Bad allocation added successfully!");
      setBadAlloteData({
        fac_id: "",
        fac_name: "",
        day: "",
        time: "",
        sub_name: "",
      });
      fetchBadAllocations(); // Refresh the bad allocations list
    } catch (err) {
      console.error("Error adding bad allocation:", err);
      setError("Failed to add bad allocation. Please try again.");
    }
  };

  return (
    <div className="faculty">
      <h1>Faculty Dashboard</h1>

      {/* Buttons for Viewing Timetables */}
      <div>
        <button onClick={() => fetchTimetable("3rdthsem")}>
          View 3rd Sem Timetable
        </button>
        <button onClick={() => fetchTimetable("5thsem")}>
          View 5th Sem Timetable
        </button>
        <button onClick={() => fetchTimetable("timetable")}>
          View 7th Sem Timetable
        </button>
      </div>

      {/* Buttons for Viewing Allocations */}
      <div>
        <button onClick={fetchDutyAllocations}>View Duty Allocations</button>
        <button onClick={fetchBadAllocations}>View Bad Allocations</button>
      </div>

      {/* Display Error Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form to Add Bad Allocation */}
      <div>
        <h2>Add Bad Allocation</h2>
        <form onSubmit={handleAddBadAllocation}>
          <input
            type="text"
            name="fac_id"
            placeholder="Faculty ID"
            value={badAlloteData.fac_id}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="fac_name"
            placeholder="Faculty Name"
            value={badAlloteData.fac_name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="day"
            placeholder="Day"
            value={badAlloteData.day}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="time"
            placeholder="Time"
            value={badAlloteData.time}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="sub_name"
            placeholder="Subject Name"
            value={badAlloteData.sub_name}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add Bad Allocation</button>
        </form>
      </div>

      {/* Display Timetable */}
      {timetable.length > 0 && (
        <div>
          <h2>Timetable</h2>
          <table border="1" style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Time</th>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.day}</td>
                  <td>{entry.time}</td>
                  <td>{entry.sub_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Duty Allocations */}
      {dutyAllocations.length > 0 && (
        <div>
          <h2>Duty Allocations</h2>
          <table border="1" style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Faculty Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {dutyAllocations.map((entry, index) => (
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

      {/* Display Bad Allocations */}
      {badAllocations.length > 0 && (
        <div>
          <h2>Bad Allocations</h2>
          <table border="1" style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Faculty Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {badAllocations.map((entry, index) => (
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

      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Faculty;
