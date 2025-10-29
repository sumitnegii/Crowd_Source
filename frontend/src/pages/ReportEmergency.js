import React, { useState } from "react";
import { auth } from "../firebase";
import axios from "axios";
import "../styles/reportEmergency.css";

const ReportEmergency = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [severity, setSeverity] = useState("Low");

  const handleSubmit = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        const user = auth.currentUser;
        const token = await user.getIdToken();

        axios.post("http://localhost:5000/report", { description, location, severity }, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => alert("Report Submitted!"))
        .catch((error) => alert(error.response.data.message));
      });
    } else {
      alert("Geolocation is not supported");
    }
  };

  return (
    <div className="report-emergency-container">
      <h2>Report Emergency</h2>
      <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <select onChange={(e) => setSeverity(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button onClick={handleSubmit}>Submit Report</button>
    </div>
  );
};

export default ReportEmergency;

