import { Link } from "react-router-dom";

export const BrandLogo = ({ to = "/home", centered = false }) => (
  <Link to={to} className={`brand ${centered ? "brand-centered" : ""}`}>
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 36 36" role="img">
        <rect x="2" y="6" width="32" height="24" rx="8" />
        <rect x="8" y="12" width="20" height="12" rx="4" />
        <circle cx="26.5" cy="18" r="1.8" />
      </svg>
    </span>
    <span>PLATES</span>
  </Link>
);
