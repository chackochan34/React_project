import React from "react";
import "./Toast.css";

function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}

export default Toast;
