import { useEffect, useState } from "react";
import { getHealth } from "../api/httpClient";

export default function AdminDashboard() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    getHealth()
      .then(setMessage)
      .catch(() => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Backend Status: {message}</p>
    </div>
  );
}
