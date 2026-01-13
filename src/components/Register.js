import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";

function Register() {
  const navigate = useNavigate();

  const register = () => {
    loginUser();
    alert("Registration successful");
    navigate("/");
  };

  return (
    <div className="page">
      <h2>Register</h2>
      <input placeholder="Name" />
      <input placeholder="Email / Phone" />
      <input type="password" placeholder="Password" />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;
