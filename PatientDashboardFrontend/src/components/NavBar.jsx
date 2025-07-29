import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload(); // refresh to reset context
  };

  return (
    <nav className="bg-white shadow-md w-full px-6 py-4 flex justify-between items-center">

      <h1 className="text-xl font-bold text-blue-700">Patient Dashboard</h1>

      <div className="flex space-x-4 items-center">
        {role === "admin" && (
          <>
            <Link
              to="/patients"
              className="text-blue-600 hover:underline font-medium"
            >
              View Patients
            </Link>
            <Link
              to="/patients/add"
              className="text-blue-600 hover:underline font-medium"
            >
              Add Patient
            </Link>
          </>
        )}

        {role === "user" && (
          <Link
            to="/contact"
            className="text-blue-600 hover:underline font-medium"
          >
            Contact
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;