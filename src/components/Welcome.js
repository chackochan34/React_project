import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <h1>PlateAuction</h1>
        <p>India’s premium fancy number auction platform</p>

        <div className="welcome-actions">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="secondary" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
