import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../common/Button";
import { BrandLogo } from "../common/BrandLogo";

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  if (!user) return null;

  return (
    <header className={`navbar ${scrolled ? "navbar-morph" : ""}`}>
      <BrandLogo to="/home" />
      <nav>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/live-auctions">Live Auctions</NavLink>
        <NavLink to="/my-bids">My Bids</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
        <NavLink to="/payments">Payments</NavLink>
        {isAdmin && <NavLink to="/admin">Admin Dashboard</NavLink>}
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" type="button" aria-label="Notifications">
          <FaBell />
        </button>
        <Button variant="ghost" onClick={toggleTheme}>
          {theme === "light" ? "Dark" : "Light"}
        </Button>
        <Link to="/profile" className="profile-pill">
          {user.name}
        </Link>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};
