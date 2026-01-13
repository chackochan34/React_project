import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import platesData from "../data/platesData";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [plates, setPlates] = useState(platesData);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("ongoing");
  const [filter, setFilter] = useState("");
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  // Countdown timer (client-side simulation)
  useEffect(() => {
    const timer = setInterval(() => {
      setPlates((prev) =>
        prev.map((p) =>
          p.status === "ongoing" && p.time > 0
            ? { ...p, time: p.time - 1 }
            : p
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const toggleWatch = (id) => {
    const updated = watchlist.includes(id)
      ? watchlist.filter((i) => i !== id)
      : [...watchlist, id];

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Premium Fancy Number Auctions</h1>
        <p>Bid on exclusive vehicle numbers across India</p>

        <input
          type="text"
          placeholder="Search fancy number (0001, 9999, 7777)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* STATUS TABS */}
      <div className="tabs">
        {["ongoing", "upcoming", "completed"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FILTER */}
      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="VIP">VIP</option>
          <option value="Fancy">Fancy</option>
        </select>
      </div>

      {/* AUCTION GRID */}
      <section className="auction-grid">
        {plates
          .filter(
            (p) =>
              p.status === tab &&
              p.number.toLowerCase().includes(search.toLowerCase()) &&
              (filter ? p.type === filter : true)
          )
          .map((plate) => (
            <div className="auction-card" key={plate.id}>
              {plate.bids > 200 && (
                <span className="trending">🔥 Trending</span>
              )}

              <span className={`badge ${plate.type.toLowerCase()}`}>
                {plate.type}
              </span>

              <div className="plate-box">{plate.number}</div>

              <p className="bids">💬 {plate.bids} bids</p>

              {plate.status === "ongoing" && (
                <p className="time">
                  ⏳ {formatTime(plate.time)}
                </p>
              )}

              {plate.status === "completed" && (
                <p className="ended">Auction Closed</p>
              )}

              <h3>₹{plate.price.toLocaleString()}</h3>

              <div className="actions">
                <button
                  disabled={plate.status !== "ongoing"}
                  onClick={() =>
                    navigate(`/bidding/${plate.id}`, { state: plate })
                  }
                >
                  {plate.status === "ongoing"
                    ? "Start Bidding"
                    : "View"}
                </button>

                <span
                  className="watch"
                  onClick={() => toggleWatch(plate.id)}
                  title="Add to watchlist"
                >
                  {watchlist.includes(plate.id) ? "⭐" : "☆"}
                </span>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}

export default Home;
