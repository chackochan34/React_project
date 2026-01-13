import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth";

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
};

export default ProtectedRoute;
