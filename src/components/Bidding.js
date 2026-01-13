import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ added
import { isLoggedIn } from "../utils/auth";                   // ✅ added
import "./Bidding.css";

const BOT_NAMES = [
  "AutoBidder_21",
  "PremiumBot",
  "QuickBid_AI",
  "SmartTrader",
  "BidMaster_X",
  "EliteBot",
];

function Bidding() {
  const { state } = useLocation();
  const navigate = useNavigate(); // ✅ added
  const plate = state || null;

  const [currentBid, setCurrentBid] = useState(plate ? plate.price : 0);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(plate ? plate.time : 0);
  const [history, setHistory] = useState([]);
  const [pulse, setPulse] = useState(false);
  const [topBidder, setTopBidder] = useState("You");

  const audioRef = useRef(null);
  const botTimerRef = useRef(null);

  // 🔐 AUTH GUARD (ESSENTIAL)
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/welcome");
    }
  }, [navigate]);

  // ⏳ Countdown (unchanged)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🤖 BOT BIDDING (UNCHANGED)
  useEffect(() => {
    if (timeLeft <= 0) return;

    const startBotBidding = () => {
      const delay = Math.floor(Math.random() * 5000) + 3000;

      botTimerRef.current = setTimeout(() => {
        const botName =
          BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];

        const increment = Math.floor(Math.random() * 5000) + 1000;
        const botBid = currentBid + increment;

        const botEntry = {
          user: botName,
          amount: botBid,
          time: "Just now",
        };

        setCurrentBid(botBid);
        setTopBidder(botName);
        setHistory((prev) => [botEntry, ...prev]);

        audioRef.current.play();
        setPulse(true);
        setTimeout(() => setPulse(false), 600);

        startBotBidding();
      }, delay);
    };

    startBotBidding();
    return () => clearTimeout(botTimerRef.current);
  }, [currentBid, timeLeft]);

  if (!plate) {
    return <div className="bidding-page">Invalid Access</div>;
  }

  // 👤 USER BID (UNCHANGED LOGIC)
  const placeBid = () => {
    if (+bidAmount <= currentBid) {
      alert("Bid must be higher than current bid");
      return;
    }

    const userBid = {
      user: "You",
      amount: +bidAmount,
      time: "Just now",
    };

    setCurrentBid(+bidAmount);
    setTopBidder("You");
    setHistory([userBid, ...history]);
    setBidAmount("");

    audioRef.current.play();
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bidding-page">
      <audio ref={audioRef} src="/sounds/ding.mp3" />

      <div className="bidding-container">
        {/* LEFT */}
        <div className="auction-info">
          <div className="plate-preview">{plate.number}</div>

          <div className="info-cards">
            <div className={`info-card ${pulse ? "pulse" : ""}`}>
              <span>Current Bid</span>
              <h2>₹{currentBid.toLocaleString()}</h2>
              <p className="top-bidder">
                👑 Top Bidder: {topBidder}
              </p>
            </div>

            <div className={`info-card timer ${timeLeft < 30 ? "urgent" : ""}`}>
              <span>Time Left</span>
              <h2>
                {timeLeft > 0 ? formatTime(timeLeft) : "Ended"}
              </h2>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bidding-panel">
          <h3>Place Your Bid</h3>

          {timeLeft > 0 ? (
            isLoggedIn() ? (   // ✅ ONLY CHANGE HERE
              <>
                <input
                  type="number"
                  placeholder="Enter higher amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />

                <button onClick={placeBid}>
                  Place Bid
                </button>
              </>
            ) : (
              <div className="login-warning">
                🔒 Please login to place a bid
              </div>
            )
          ) : (
            <div className="winner">
              🏆 Auction Closed <br />
              Winning Bid: ₹{currentBid.toLocaleString()}
              <br />
              Winner: {topBidder}
            </div>
          )}

          {/* LIVE ACTIVITY (UNCHANGED) */}
          <div className="history">
            <h4>Live Activity</h4>

            {history.length === 0 && (
              <p className="empty">No bids yet</p>
            )}

            {history.map((b, i) => (
              <div key={i} className="history-item slide-in">
                <span>
                  {b.user === topBidder ? "👑 " : ""}
                  {b.user}
                </span>
                <strong>₹{b.amount}</strong>
                <small>{b.time}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bidding;
