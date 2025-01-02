import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SeventhSem.css";
import SeventhSem from "./SeventhSem";
import FifthSem from "./FifthSem";
import ThirdSem from "./ThirdSem";
import DutyAllote from "./DutyAllote"; // Import the DutyAllote component
import BadAllote from "./BadAllote"; // Import the BadAllote component

const Admin = () => {
  const [selectedSem, setSelectedSem] = useState("");
  const [isDutyAllocation, setIsDutyAllocation] = useState(false); // State to track if duty allocation page is open
  const [isBadAllote, setIsBadAllote] = useState(false); // State to track if bad_allote page is open
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };

  const handleSample = () => {
    navigate("/Sample");
  };

  // Render the appropriate component based on the selected semester, duty allocation, or bad_allote
  if (isDutyAllocation) {
    return <DutyAllote goBack={() => setIsDutyAllocation(false)} />;
  }

  if (isBadAllote) {
    return <BadAllote goBack={() => setIsBadAllote(false)} />;
  }

  if (selectedSem === "7th")
    return <SeventhSem goBack={() => setSelectedSem("")} />;
  if (selectedSem === "5th")
    return <FifthSem goBack={() => setSelectedSem("")} />;
  if (selectedSem === "3rd")
    return <ThirdSem goBack={() => setSelectedSem("")} />;

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>In-Semester Time Table</h1>
      <h2>Admin Console</h2>
      <button onClick={() => setSelectedSem("7th")} style={{ margin: "10px" }}>
        Timetable (7th Sem)
      </button>
      <button onClick={() => setSelectedSem("5th")} style={{ margin: "10px" }}>
        Timetable (5th Sem)
      </button>
      <button onClick={() => setSelectedSem("3rd")} style={{ margin: "10px" }}>
        Timetable (3rd Sem)
      </button>
      <button onClick={handleSample} style={{ margin: "10px" }}>
        next module
      </button>

      {/* Button to open Duty Allocation page */}
      <button
        onClick={() => setIsDutyAllocation(true)}
        style={{ margin: "10px", marginTop: "20px" }}
      >
        Allocate Duty
      </button>

      {/* Button to open Bad Allocation page */}
      <button
        onClick={() => setIsBadAllote(true)}
        style={{ margin: "10px", marginTop: "20px" }}
      >
        View Bad Allocations
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          margin: "10px",
          marginTop: "30px",
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Admin;

// 9000
