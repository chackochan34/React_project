import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const login = () => {
    loginUser();
    alert("Login successful");
    navigate("/");
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <input placeholder="Email / Phone" />
      <input type="password" placeholder="Password" />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
