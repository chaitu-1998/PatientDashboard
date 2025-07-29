import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/patients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    const fetchStatuses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/patients/statuses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatuses(res.data);
      } catch (err) {
        console.error("Error fetching statuses:", err);
      }
    };

    fetchPatients();
    fetchStatuses();
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/patients/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Patient List</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-1 rounded w-1/3"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No matching patients.</div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">DOB</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-100">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.firstName} {p.middleName} {p.lastName}
                </td>
                <td className="px-6 py-4">{p.dob}</td>
                <td className="px-6 py-4">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {statuses.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  {p.street}, {p.aptUnit}, {p.city}, {p.state}, {p.postalCode}, {p.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;