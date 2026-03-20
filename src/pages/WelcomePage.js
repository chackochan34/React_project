import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/common/Button";
import { BrandLogo } from "../components/common/BrandLogo";
import "../styles/welcome.css";

const features = [
  { title: "Live Bidding", desc: "Compete for premium plates in active timed auctions." },
  { title: "Secure Payments", desc: "Protected payment workflow with transparent records." },
  { title: "Real-Time Updates", desc: "Instant bid and timer updates throughout each auction." },
  { title: "Premium Plates", desc: "Exclusive fancy and VIP registration numbers across India." },
];

const stats = [
  { label: "Active Bidders", value: "12.5K+" },
  { label: "Live Auctions", value: "320+" },
  { label: "Plates Sold", value: "18K+" },
  { label: "Total Bids", value: "1.2M+" },
];

const Section = ({ title, children }) => (
  <section className="wl-section">
    <h2>{title}</h2>
    {children}
  </section>
);

export const WelcomePage = () => {
  return (
    <main className="wl-page">
      <div className="wl-shell">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="wl-hero">
          <div className="wl-hero-copy">
            <span className="wl-kicker">Trusted Platform for Premium Plates</span>
            <BrandLogo to="/welcome" />
            <h1>Number Plate Auction Platform</h1>
            <p>
              Discover, bid, and own exclusive number plates with a secure and transparent real-time auction
              experience built for modern buyers.
            </p>
            <div className="wl-actions">
              <Link to="/live-auctions">
                <Button>Start Bidding</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </div>
          </div>
          <div className="wl-hero-panel">
            <h3>Why buyers choose PlateAuction</h3>
            <ul>
              <li>Verified listings with clear auction timelines</li>
              <li>Live bidding with instant price updates</li>
              <li>Secure payment records and full transparency</li>
            </ul>
            <div className="wl-mini-stats">
              {stats.slice(0, 2).map((stat) => (
                <article key={`hero-${stat.label}`}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <Section title="About PlateAuction">
          <p className="wl-text">
            PlateAuction is India&apos;s premium online platform for bidding on exclusive VIP and fancy vehicle number
            plates. We provide a secure, transparent, and real-time auction experience designed for trust and speed.
          </p>
        </Section>

        <Section title="What is Bidding?">
          <article className="wl-bidding-card">
            <div className="wl-bid-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 10h12M6 14h8M5 4h14a1 1 0 0 1 1 1v14H4V5a1 1 0 0 1 1-1Z" />
              </svg>
            </div>
            <p>
              Bidding is a competitive process where users place offers on number plates. The highest bid at the end
              of the timer wins the auction.
            </p>
          </article>
        </Section>

        <Section title="How It Works">
          <div className="wl-grid wl-process-grid">
            {[
              { step: "01", title: "Create Account", desc: "Register and complete your profile to start participating." },
              { step: "02", title: "Choose a Plate", desc: "Browse ongoing and incoming auctions by category." },
              { step: "03", title: "Place Bids", desc: "Bid in real-time and stay ahead with live updates." },
              { step: "04", title: "Complete Payment", desc: "Settle winning bids securely and access history anytime." },
            ].map((item) => (
              <article key={item.step} className="wl-card wl-process-card">
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </Section>

        <section className="wl-quote">
          <blockquote>&ldquo;Every number has a story. Own yours.&rdquo;</blockquote>
        </section>

        <Section title="Feature Highlights">
          <div className="wl-grid wl-feature-grid">
            {features.map((item) => (
              <article key={item.title} className="wl-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Live Stats">
          <div className="wl-grid wl-stats-grid">
            {stats.map((stat) => (
              <article key={stat.label} className="wl-card wl-stat-card">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
        </Section>

        <section className="wl-auth-cta">
          <div>
            <h2>Ready to Bid on Premium Plates?</h2>
            <p>Join PlateAuction to participate in live auctions and secure your dream number.</p>
          </div>
          <div className="wl-actions">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};
