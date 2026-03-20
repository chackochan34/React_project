import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Button } from "../components/common/Button";
import { BrandLogo } from "../components/common/BrandLogo";

export const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const { pushToast } = useNotification();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(form);
      pushToast({ type: "success", title: "Welcome back", message: "Login successful." });
      navigate(data?.user?.role === "admin" ? "/admin" : "/home");
    } catch (error) {
      pushToast({ type: "error", title: "Login failed", message: error.message });
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-showcase">
          <span className="auth-pill">Live Plate Bidding</span>
          <h1>Welcome back to the auction floor</h1>
          <p>Track active bids, watch premium numbers, and close high-value deals before the timer ends.</p>
          <div className="auth-showcase-stats">
            <article>
              <strong>120+</strong>
              <span>Live auctions</span>
            </article>
            <article>
              <strong>3.8K</strong>
              <span>Active bidders</span>
            </article>
          </div>
          <div className="auth-glow auth-glow-a" />
          <div className="auth-glow auth-glow-b" />
        </aside>

        <form className="auth-card auth-card-fancy" onSubmit={submit}>
          <BrandLogo to="/welcome" centered />
          <div className="auth-title">
            <h2>Login</h2>
            <p>Access your dashboard and continue bidding.</p>
          </div>
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Sign In"}
          </Button>
          <p className="auth-switch">
            New user? <Link to="/register">Create account</Link>
          </p>
          <p className="muted">Admin users are automatically redirected to the Admin Dashboard after login.</p>
        </form>
      </section>
    </main>
  );
};
