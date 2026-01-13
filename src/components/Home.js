import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import platesData from "../data/platesData";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [plates, setPlates] = useState(platesData);

  // Filters
  const [tab, setTab] = useState("ongoing");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [digitsFilter, setDigitsFilter] = useState("");

  // ⏳ Countdown (only for ongoing)
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

  // ✅ Extract State Name from number plate
  // Example: "KL 07 AB 0001" => "KL"
  const getStateCode = (plateNumber) => plateNumber.split(" ")[0];

  // ✅ Digits count
  const getDigits = (plateNumber) => {
    const lastPart = plateNumber.split(" ").pop();
    return lastPart.length;
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // ✅ Unique states for dropdown
  const uniqueStates = useMemo(() => {
    const codes = new Set(plates.map((p) => getStateCode(p.number)));
    return Array.from(codes).sort();
  }, [plates]);

  // ✅ Filtered plates
  const filteredPlates = useMemo(() => {
    return plates.filter((p) => {
      const matchTab = p.status === tab;

      const matchSearch =
        p.number.toLowerCase().includes(search.toLowerCase());

      const matchType =
        typeFilter === "" ? true : p.type === typeFilter;

      const matchState =
        stateFilter === "" ? true : getStateCode(p.number) === stateFilter;

      const matchDigits =
        digitsFilter === "" ? true : getDigits(p.number) === Number(digitsFilter);

      return matchTab && matchSearch && matchType && matchState && matchDigits;
    });
  }, [plates, tab, search, typeFilter, stateFilter, digitsFilter]);

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <h1>Premium Fancy Number Auctions</h1>
        <p>Filter and bid on exclusive vehicle numbers across India</p>
      </section>

      {/* FILTER BAR */}
      <div className="filter-box">
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

              <div className="plate-box">{plate.number}</div>

              <p className="meta">
                📍 {getStateCode(plate.number)} • 🔢 {getDigits(plate.number)} digits
              </p>

              <p className="bids">💬 {plate.bids} bids</p>

              {plate.status === "ongoing" && (
                <p className="time">⏳ {formatTime(plate.time)}</p>
              )}

              {plate.status === "completed" && (
                <p className="ended">Auction Closed</p>
              )}

              <h3>₹{plate.price.toLocaleString("en-IN")}</h3>

              <button
                className="bid-btn"
                disabled={plate.status !== "ongoing"}
                onClick={() =>
                  navigate(`/bidding/${plate.id}`, { state: plate })
                }
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
