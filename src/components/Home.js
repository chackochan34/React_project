import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import platesData from "../data/platesData";
import "./Home.css";
import Toast from "./Toast";

function Home() {
  const navigate = useNavigate();

  const [plates, setPlates] = useState(platesData);

  // Filters
  const [tab, setTab] = useState("ongoing");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [digitsFilter, setDigitsFilter] = useState("");

  // ✅ NEW: Sorting feature
  const [sortBy, setSortBy] = useState("endingSoon");

  // ✅ NEW: Watchlist Feature
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  // ✅ Toast state
  const [toast, setToast] = useState({ message: "", type: "info" });

  // ⏳ Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setPlates((prev) =>
        prev.map((p) =>
          p.status === "ongoing" && p.time > 0 ? { ...p, time: p.time - 1 } : p
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStateCode = (plateNumber) => plateNumber.split(" ")[0];

  const getDigits = (plateNumber) => {
    const lastPart = plateNumber.split(" ").pop();
    return lastPart.length;
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const uniqueStates = useMemo(() => {
    const codes = new Set(plates.map((p) => getStateCode(p.number)));
    return Array.from(codes).sort();
  }, [plates]);

  const toggleWatchlist = (id) => {
    let updated;
    if (watchlist.includes(id)) {
      updated = watchlist.filter((x) => x !== id);
      setToast({ message: "Removed from Watchlist ⭐", type: "info" });
    } else {
      updated = [...watchlist, id];
      setToast({ message: "Added to Watchlist ✅⭐", type: "success" });
    }

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));

    setTimeout(() => setToast({ message: "", type: "info" }), 2000);
  };

  // ✅ Filter + Sort
  const filteredPlates = useMemo(() => {
    let list = plates.filter((p) => {
      const matchTab = p.status === tab;
      const matchSearch = p.number.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "" ? true : p.type === typeFilter;
      const matchState =
        stateFilter === "" ? true : getStateCode(p.number) === stateFilter;
      const matchDigits =
        digitsFilter === "" ? true : getDigits(p.number) === Number(digitsFilter);

      return matchTab && matchSearch && matchType && matchState && matchDigits;
    });

    // ✅ Sorting
    if (sortBy === "endingSoon") {
      list.sort((a, b) => (a.time || 999999) - (b.time || 999999));
    } else if (sortBy === "highestBid") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "mostBids") {
      list.sort((a, b) => (b.bids || 0) - (a.bids || 0));
    }

    return list;
  }, [plates, tab, search, typeFilter, stateFilter, digitsFilter, sortBy]);

  return (
    <div className="home-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />

      <section className="hero">
        <h1>Premium Fancy Number Auctions</h1>
        <p>Search, filter, sort and bid on exclusive number plates</p>
      </section>

      <div className="filter-box">
        {/* Tabs */}
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

        {/* Filters */}
        <div className="filters">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Plate Type</option>
            <option value="VIP">VIP</option>
            <option value="Fancy">Fancy</option>
          </select>

          <select value={digitsFilter} onChange={(e) => setDigitsFilter(e.target.value)}>
            <option value="">Digits</option>
            <option value="4">4 Digits</option>
          </select>

          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
            <option value="">State</option>
            {uniqueStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search plate number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setTypeFilter("");
              setDigitsFilter("");
              setStateFilter("");
            }}
          >
            Clear
          </button>
        </div>

        {/* ✅ Sorting */}
        <div className="sort-row">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="endingSoon">Sort: Ending Soon ⏳</option>
            <option value="highestBid">Sort: Highest Price 💰</option>
            <option value="mostBids">Sort: Most Bids 🔥</option>
          </select>

          <div className="watch-count">
            ⭐ Watchlist: <b>{watchlist.length}</b>
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="auction-grid">
        {filteredPlates.length === 0 ? (
          <p className="empty-msg">No auctions found 🚫</p>
        ) : (
          filteredPlates.map((plate) => (
            <div className="auction-card" key={plate.id}>
              {plate.bids > 200 && <span className="trending">🔥 Trending</span>}

              <span className={`badge ${plate.type.toLowerCase()}`}>
                {plate.type}
              </span>

              {/* ⭐ Watch */}
              <button
                className="watch-btn"
                onClick={() => toggleWatchlist(plate.id)}
                title="Add to Watchlist"
              >
                {watchlist.includes(plate.id) ? "⭐" : "☆"}
              </button>

              <div className="plate-box">{plate.number}</div>

              <p className="meta">
                📍 {getStateCode(plate.number)} • 🔢 {getDigits(plate.number)} digits
              </p>

              <p className="bids">💬 {plate.bids} bids</p>

              {plate.status === "ongoing" && (
                <p className="time">⏳ {formatTime(plate.time)}</p>
              )}

              {plate.status === "completed" && <p className="ended">Auction Closed</p>}

              <h3>₹{plate.price.toLocaleString("en-IN")}</h3>

              <button
                className="bid-btn"
                disabled={plate.status !== "ongoing"}
                onClick={() => navigate(`/bidding/${plate.id}`, { state: plate })}
              >
                {plate.status === "ongoing" ? "Start Bidding" : "View"}
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Home;
