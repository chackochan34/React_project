import { motion } from "framer-motion";

export const AboutPage = () => (
  <main className="page">
    <section className="section">
      <h1>About</h1>
      <p className="muted">Premium Fancy Number Auction Platform for curated Indian registration numbers.</p>
    </section>

    <section className="section">
      <h2>Categories</h2>
      <div className="categories">
        {["Fancy", "VIP", "Trending", "Normal", "Cheap"].map((type) => (
          <motion.article key={type} whileHover={{ y: -4 }} className="category-block">
            <h3>{type}</h3>
            <p>Curated premium {type.toLowerCase()} number plates.</p>
          </motion.article>
        ))}
      </div>
    </section>

    <section className="section split">
      <div>
        <h2>How It Works</h2>
        <ol>
          <li>Create account and verify profile.</li>
          <li>Track and watch live auctions.</li>
          <li>Place secure bids and settle payment.</li>
        </ol>
      </div>
      <div className="glass-panel">
        <h3>Startup-grade auction experience</h3>
        <p>Clean UX, smart filters, watchlist, admin analytics and payment simulation.</p>
      </div>
    </section>
  </main>
);
