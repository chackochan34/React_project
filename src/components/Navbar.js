import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="logo">
          Plate<span>Auction</span>
        </span>
      </div>

      <nav className="navbar-center">
        <NavLink to="/" className="nav-link">
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
      </nav>

      <div className="navbar-right">
        <NavLink to="/login" className="login-btn">
          Login
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
