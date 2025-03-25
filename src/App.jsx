import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
const App = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Updated Role:", localStorage.getItem("role"));
      setUserRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/me" element={<Register />} />
        <Route path="/employee-dashboard" element={userRole === "employee" ? <EmployeeDashboard /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
