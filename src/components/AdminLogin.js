import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../utils/auth";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();

    // ✅ Demo credentials (you can change)
    if (username === "admin" && password === "admin123") {
      loginAdmin();
      alert("Admin Login Successful ✅");
      navigate("/admin");
    } else {
      alert("Invalid Admin Credentials ❌\nTry: admin / admin123");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <p className="sub">Only admins can access dashboard</p>

        <form onSubmit={handleAdminLogin}>
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login as Admin</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
