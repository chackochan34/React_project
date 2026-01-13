import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLogin from "./components/AdminLogin";

import Navbar from "./components/Navbar";

import Home from "./components/Home";
import Bidding from "./components/Bidding";
import MyBids from "./components/Mybids";
import Payment from "./components/Payment";
import AdminDashboard from "./components/AdminDashboard";

import ProtectedRoute from "./utils/ProtectedRoute";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import { isLoggedIn } from "./utils/auth";

function App() {
  return (
    <>
      {/* ✅ Navbar only for normal users after login */}
      {isLoggedIn() && <Navbar />}

      <Routes>
        {/* ✅ Default route */}
        <Route
          path="/"
          element={
            isLoggedIn() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/welcome" replace />
            )
          }
        />

        {/* ✅ Public Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Admin Login Separate */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ✅ Protected User Routes */}
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

        <Route
          path="/mybids"
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* ✅ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
