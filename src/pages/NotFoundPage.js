import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <main className="center-page">
    <section className="glass-panel">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/home">Go Home</Link>
    </section>
  </main>
);
