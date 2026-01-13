import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Bidding from "./components/Bidding";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./utils/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

function App() {
  return (
    <>
      {/* ✅ Show navbar ONLY after login */}
      {isLoggedIn() && <Navbar />}

      <Routes>
        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            isLoggedIn() ? <Navigate to="/home" /> : <Navigate to="/welcome" />
          }
        />

        {/* PUBLIC ROUTES */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bidding/:id"
          element={
            <ProtectedRoute>
              <Bidding />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
