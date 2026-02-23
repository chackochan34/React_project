import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Toast from "./Toast";

const stateCards = [
  { name: "Tamil Nadu", code: "TN", mode: "Request Plate", count: null },
  { name: "Kerala", code: "KL", mode: "Direct Sale", count: 52 },
  { name: "Maharashtra", code: "MH", mode: "Direct Sale", count: 74 },
  { name: "Karnataka", code: "KA", mode: "Direct Sale", count: 46 },
  { name: "Delhi", code: "DL", mode: "Direct Sale", count: 39 },
  { name: "Gujarat", code: "GJ", mode: "Direct Sale", count: 44 },
];

function Home() {
  const navigate = useNavigate();
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab] = useState("ongoing");
  const [search] = useState("");
  const [typeFilter] = useState("");
  const [stateFilter] = useState("");
  const [digitsFilter] = useState("");
  const [sortBy] = useState("endingSoon");
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/plates");
        const data = await response.json();
        const mappedData = data.map((plate) => ({
          id: plate._id,
          number: plate.number,
          type: plate.type,
          price: plate.currentPrice,
          bids: plate.bidsCount,
          time: plate.timeRemaining,
          status: plate.status,
          description: plate.description || "Premium number plate",
        }));
        setPlates(mappedData);
      } catch (err) {
        console.error("Failed to fetch plates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlates();
  }, []);

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

  const toggleWatchlist = (id) => {
    let updated;
    if (watchlist.includes(id)) {
      updated = watchlist.filter((x) => x !== id);
      setToast({ message: "Removed from Watchlist", type: "info" });
    } else {
      updated = [...watchlist, id];
      setToast({ message: "Added to Watchlist", type: "success" });
    }

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    setTimeout(() => setToast({ message: "", type: "info" }), 2000);
  };

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
        <h1>Exclusive Number Plates</h1>
        <p>Bid on premium vehicle registration numbers</p>
        <div className="hero-buttons">
          <button className="hero-btn explore">Browse Auctions</button>
          <button className="hero-btn sell">List Your Plate</button>
        </div>
      </section>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          Loading plates...
        </div>
      ) : null}

      <section className="featured-grid">
        {stateCards.map((card) => (
          <div className="state-card" key={card.code}>
            <div className="state-card-header">{card.name}</div>
            <div className="state-card-body">
              <h4>{card.name} Plates</h4>
              {card.count !== null && (
                <div className="state-muted">
                  {card.mode} <span className="pill">{card.count}</span>
                </div>
              )}
              <button className="state-btn">
                {card.count === null ? "Request Plate ->" : "Buy Now"}
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="auction-grid">
        {filteredPlates.length === 0 ? (
          <p className="empty-msg">No auctions found</p>
        ) : (
          filteredPlates.map((plate) => (
            <div className="auction-card" key={plate.id}>
              {plate.bids > 200 && <span className="trending">Trending</span>}

              <span className={`badge ${plate.type.toLowerCase()}`}>
                {plate.type}
              </span>

              <button
                className="watch-btn"
                onClick={() => toggleWatchlist(plate.id)}
                title="Add to Watchlist"
              >
                {watchlist.includes(plate.id) ? "*" : "+"}
              </button>

              <div className="plate-box">{plate.number}</div>

              <p className="meta">
                {getStateCode(plate.number)} | {getDigits(plate.number)} digits
              </p>

              <p className="bids">{plate.bids} bids</p>

              {plate.status === "ongoing" && (
                <p className="time">{formatTime(plate.time)}</p>
              )}

              {plate.status === "completed" && (
                <p className="ended">Auction Closed</p>
              )}

              <h3>Rs. {plate.price.toLocaleString("en-IN")}</h3>

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
