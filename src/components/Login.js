import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/auth";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ mock login success
    loginUser();
    alert("Login successful ✅");

    // ✅ redirect to home
    navigate("/home");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back! Please login to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email / Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-footer">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
