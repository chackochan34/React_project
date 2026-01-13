import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth";

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/welcome" replace />;
};

export default ProtectedRoute;
