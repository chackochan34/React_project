import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "./auth";

const AdminProtectedRoute = ({ children }) => {
  return isAdminLoggedIn() ? children : <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;
