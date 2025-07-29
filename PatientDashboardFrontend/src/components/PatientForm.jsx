import React, { useState } from "react";
import axios from "axios";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    country: "",
    state: "",
    city: "",
    street: "",
    aptUnit: "",
    postalCode: "",
    status: "Inquiry",
  });

  const [suggestions, setSuggestions] = useState({
    country: [],
    state: [],
    city: [],
    street: [],
  });

  const fetchSuggestions = async (type, query) => {
    if (!query) return;

    try {
      if (type === "country") {
        const res = await axios.get("https://restcountries.com/v3.1/all?fields=name");
        const filtered = res.data
          .map((c) => c.name.common)
          .filter((name) => name.toLowerCase().includes(query.toLowerCase()));
        setSuggestions((prev) => ({ ...prev, country: filtered.slice(0, 5) }));
      }

      if (type === "state" && formData.country) {
        const res = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
          country: formData.country,
        });
        const filtered = res.data.data.states
          .map((s) => s.name)
          .filter((s) => s.toLowerCase().includes(query.toLowerCase()));
        setSuggestions((prev) => ({ ...prev, state: filtered.slice(0, 5) }));
      }

      if (type === "city" && formData.country && formData.state) {
        const res = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
          country: formData.country,
          state: formData.state,
        });
        const filtered = res.data.data.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
        setSuggestions((prev) => ({ ...prev, city: filtered.slice(0, 5) }));
      }

      if (type === "street" && formData.city && formData.state && formData.country) {
        const res = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: `${query}, ${formData.city}, ${formData.state}, ${formData.country}`,
            format: "json",
            addressdetails: 1,
            limit: 10,
          },
          headers: { "Accept-Language": "en" },
        });

        const roads = res.data.map((r) => {
        const { house_number, road } = r.address || {};
        return road ? `${house_number ?? ""} ${road}`.trim() : null;
  })
  .filter(Boolean);

        // remove duplicates
        const uniqueRoads = [...new Set(roads)];
        setSuggestions((prev) => ({ ...prev, street: uniqueRoads.slice(0, 5) }));
      }
    } catch (err) {
      console.error(`${type} fetch error:`, err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    fetchSuggestions(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/patients/create", {
        ...formData,
        status: "Inquiry",
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Patient submitted!");
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        country: "",
        state: "",
        city: "",
        street: "",
        aptUnit: "",
        postalCode: "",
        status: "Inquiry",
      });
      console.log(formData);
      setSuggestions({ country: [], state: [], city: [], street: [] });
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit patient.");
    }
  };

  const renderSuggestionInput = (label, name) => (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">{label}</label>
      </div>
      <div className="md:w-2/3 relative">
        <input
          type="text"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="bg-gray-100 border-2 border-gray-200 rounded w-full py-2 px-4"
          required
        />
        {suggestions[name]?.length > 0 && (
          <ul className="absolute w-full bg-white border rounded shadow z-10 max-h-40 overflow-y-auto mt-1">
            {suggestions[name].map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  const reset = name === "country" ? { state: "", city: "" } : name === "state" ? { city: "" } : {};
                  setFormData((prev) => ({ ...prev, [name]: s, ...reset }));
                  setSuggestions((prev) => ({ ...prev, [name]: [] }));
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">Patient Info</h2>

      {["firstName", "middleName", "lastName", "dob"].map((field) => (
        <div className="md:flex md:items-center mb-6" key={field}>
          <div className="md:w-1/3">
            <label htmlFor={field} className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              {field === "dob" ? "Date of Birth" : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              type={field === "dob" ? "date" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="bg-gray-100 border-2 border-gray-200 rounded w-full py-2 px-4"
              required={field !== "middleName"}
            />
          </div>
        </div>
      ))}

      {renderSuggestionInput("Country", "country")}
      {renderSuggestionInput("State", "state")}
      {renderSuggestionInput("City", "city")}
      {renderSuggestionInput("Street", "street")}

      {/* Apt/Unit */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label htmlFor="aptUnit" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Apt / Unit
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            type="text"
            id="aptUnit"
            name="aptUnit"
            value={formData.aptUnit}
            onChange={handleChange}
            placeholder="Apt or Unit"
            className="bg-gray-100 border-2 border-gray-200 rounded w-full py-2 px-4"
          />
        </div>
      </div>

      {/* ZIP */}
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/3">
          <label htmlFor="postalCode" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            ZIP / Postal Code
          </label>
        </div>
        <div className="md:w-2/3">
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="ZIP / Postal Code"
            className="bg-gray-100 border-2 border-gray-200 rounded w-full py-2 px-4"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Submit Patient
        </button>
      </div>
    </form>
  );
};

export default PatientForm;