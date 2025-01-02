import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/components/login.jsx";
import Faculty from "./assets/components/faculty.jsx";
import Admin from "./assets/components/admin.jsx";
import Sample from "./assets/components/sample.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/Sample" element={<Sample />} />
      </Routes>
    </Router>
  );
}

export default App;
