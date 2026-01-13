import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    alert("Logged out ✅");
    navigate("/welcome");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate("/home")}>
        Plate<span>Auction</span>
      </div>

      {/* Links */}
      <nav className="nav-links">
        <NavLink to="/home" className="nav-link">
          Home
        </NavLink>

        <NavLink to="/mybids" className="nav-link">
          My Bids
        </NavLink>

        <NavLink to="/payment" className="nav-link">
          Payment
        </NavLink>

        <NavLink to="/admin" className="nav-link">
          Admin Dashboard
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
