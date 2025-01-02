import React, { useState, useEffect } from "react";

const BadAllote = ({ goBack }) => {
  const [badAllocations, setBadAllocations] = useState([]);
  const [updateData, setUpdateData] = useState({
    fac_id: "",
    fac_name: "",
    day: "",
    time: "",
    sub_name: "",
  });
  const [deleteFacId, setDeleteFacId] = useState(""); // State for delete input

  // Fetch all bad allocations
  const fetchBadAllocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/getduty/bad_allote");
      const data = await response.json();
      setBadAllocations(data);
    } catch (err) {
      console.error("Error fetching bad allocations:", err);
    }
  };

  const deleteBadAllocation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/delete-badallote/${deleteFacId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Bad allocation deleted successfully!");
        fetchBadAllocations(); // Refresh the bad allocations list
        setDeleteFacId(""); // Reset the delete input
      } else {
        alert("Failed to delete bad allocation.");
      }
    } catch (err) {
      console.error("Error deleting bad allocation:", err);
    }
  };

  // Update an entry in the duty_allote table
  const updateDutyAllote = async (e) => {
    e.preventDefault();
    console.log(updateData); // Log the data being sent for debugging
    try {
      const response = await fetch(
        "http://localhost:8000/updateduty/duty_allote",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        alert("Duty allocation updated successfully!");
        fetchBadAllocations(); // Refresh the bad allocations list
        setUpdateData({
          fac_id: "",
          fac_name: "",
          day: "",
          time: "",
          sub_name: "",
        }); // Reset form
      } else {
        alert("Failed to update duty allocation.");
      }
    } catch (err) {
      console.error("Error updating duty allocation:", err);
    }
  };

  // Fetch bad allocations on component mount
  useEffect(() => {
    fetchBadAllocations();
  }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>Bad Allocations</h1>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        Go Back
      </button>

      {/* Display Bad Allocations */}
      <table border="1" style={{ margin: "auto", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Fac ID</th>
            <th>Fac Name</th>
            <th>Day</th>
            <th>Time</th>
            <th>Sub Name</th>
          </tr>
        </thead>
        <tbody>
          {badAllocations.map((allocation, index) => (
            <tr key={index}>
              <td>{allocation.fac_id}</td>
              <td>{allocation.fac_name}</td>
              <td>{allocation.day}</td>
              <td>{allocation.time}</td>
              <td>{allocation.sub_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Bad Allocation */}
      <h2>Delete Bad Allocation</h2>
      <form onSubmit={deleteBadAllocation}>
        <input
          type="text"
          placeholder="Faculty ID"
          value={deleteFacId}
          onChange={(e) => setDeleteFacId(e.target.value)}
          required
          style={{ margin: "5px" }}
        />
        <button type="submit" style={{ margin: "5px" }}>
          Delete Bad Allocation
        </button>
      </form>

      {/* Update Duty Allocation */}
      <h2>Update Duty Allocation</h2>
      <form onSubmit={updateDutyAllote}>
        <input
          type="text"
          placeholder="Faculty ID"
          value={updateData.fac_id}
          onChange={(e) =>
            setUpdateData({ ...updateData, fac_id: e.target.value })
          }
          required
          style={{ margin: "5px" }}
        />
        <input
          type="text"
          placeholder="Faculty Name"
          value={updateData.fac_name}
          onChange={(e) =>
            setUpdateData({ ...updateData, fac_name: e.target.value })
          }
          required
          style={{ margin: "5px" }}
        />
        <input
          type="text"
          placeholder="Day"
          value={updateData.day}
          onChange={(e) =>
            setUpdateData({ ...updateData, day: e.target.value })
          }
          required
          style={{ margin: "5px" }}
        />
        <input
          type="text"
          placeholder="Time"
          value={updateData.time}
          onChange={(e) =>
            setUpdateData({ ...updateData, time: e.target.value })
          }
          required
          style={{ margin: "5px" }}
        />
        <input
          type="text"
          placeholder="Subject Name"
          value={updateData.sub_name}
          onChange={(e) =>
            setUpdateData({ ...updateData, sub_name: e.target.value })
          }
          required
          style={{ margin: "5px" }}
        />
        <button type="submit" style={{ margin: "5px" }}>
          Update Duty
        </button>
      </form>
    </div>
  );
};

export default BadAllote;

// 9000
