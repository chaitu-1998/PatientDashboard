import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import Login from "./Pages/login";
import Navbar from "./components/Navbar"; // ✅ Add your Navbar

function AppWrapper() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const isLoggedIn = !!role;

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogin = (userRole) => {
    setRole(userRole);
    localStorage.setItem("role", userRole);
  };

  const location = useLocation();

  return (
    <>
      {/* Show navbar only if logged in */}
      {isLoggedIn && location.pathname !== "/login" && <Navbar role={role} />}

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Admin routes */}
        {role === "admin" && (
          <>
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/add" element={<PatientForm />} />
          </>
        )}

        {/* User routes */}
        {role === "user" && (
          <>
            <Route path="/patients/add" element={<PatientForm />} />
            <Route path="/patients" element={<Navigate to="/patients/add" />} />
          </>
        )}

        {/* If not logged in, redirect any other route to login */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}

        {/* Default redirect based on role */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              role === "admin" ? <Navigate to="/patients" /> : <Navigate to="/patients/add" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}