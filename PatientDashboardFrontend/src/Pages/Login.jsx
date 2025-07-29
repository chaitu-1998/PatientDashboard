import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/patients/login", formData);
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      onLogin(role); // pass role to parent
      navigate(role === "admin" ? "/patients":"/patients/add");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-20">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            name="password"
            type="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && (
            <p className="text-red-500 text-xs italic">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>

      <p className="text-center text-gray-500 text-xs">
        &copy;2025 Your App. All rights reserved.
      </p>
    </div>
  );
};

export default Login;