import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Button } from "../components/common/Button";
import { BrandLogo } from "../components/common/BrandLogo";
import { PasswordStrength } from "../components/common/PasswordStrength";

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register, loading } = useAuth();
  const { pushToast } = useNotification();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      pushToast({ type: "success", title: "Registered", message: "Account created successfully." });
      navigate("/home");
    } catch (error) {
      pushToast({ type: "error", title: "Register failed", message: error.message });
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-showcase auth-showcase-register">
          <span className="auth-pill">New Account</span>
          <h1>Join and bid on premium number plates</h1>
          <p>Create your account to watch, bid, and settle deals from one clean control panel.</p>
          <ul className="auth-feature-list">
            <li>Track live and incoming auctions</li>
            <li>Save favorites in your watchlist</li>
            <li>Manage bids and payment history</li>
          </ul>
          <div className="auth-glow auth-glow-a" />
          <div className="auth-glow auth-glow-b" />
        </aside>

        <form className="auth-card auth-card-fancy" onSubmit={submit}>
          <BrandLogo to="/welcome" centered />
          <div className="auth-title">
            <h2>Create Account</h2>
            <p>Start participating in live auctions in less than a minute.</p>
          </div>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <PasswordStrength password={form.password} />
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Create account"}
          </Button>
          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
};
