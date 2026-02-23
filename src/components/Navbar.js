import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showBuyMenu, setShowBuyMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const buyRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (buyRef.current && !buyRef.current.contains(e.target)) {
        setShowBuyMenu(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  return (
    <header className="ea-header">
      <div className="ea-topbar">
        <div className="ea-top-left"></div>
        <div className="ea-top-right">
          <a href="#">About EA</a>
          <a href="#">Auction Calendar</a>
          <a href="#">Sell with us</a>
          <a href="#">Help</a>
          <a href="#">Find Us</a>
          <a href="#">Contact Us</a>
        </div>
      </div>

      <div className="ea-main">
        <div className="ea-logo" onClick={() => navigate("/home")}>
          <div className="ea-logo-mark">
            <span className="chevrons">^^^</span>
          </div>
          <div className="ea-logo-text">
            <div className="ea-arabic">EMIRATES AUCTION</div>
            <div className="ea-english">EMIRATES AUCTION</div>
          </div>
        </div>

        <nav className="ea-categories">
          <div className="cat-wrapper" ref={buyRef}>
            <button
              className="cat buy-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowBuyMenu((prev) => !prev);
              }}
              aria-haspopup="true"
              aria-expanded={showBuyMenu}
            >
              Buy <span className="caret"></span>
            </button>

            {showBuyMenu && (
              <div className="buy-dropdown" role="menu" onClick={(e) => e.stopPropagation()}>
                <button className="buy-item" onClick={() => { setShowBuyMenu(false); navigate("/buy/fancy"); }}>
                  Fancy numbers
                </button>
                <button className="buy-item" onClick={() => { setShowBuyMenu(false); navigate("/buy/cheap"); }}>
                  Cheap numbers
                </button>
                <button className="buy-item" onClick={() => { setShowBuyMenu(false); navigate("/buy/all"); }}>
                  All numbers
                </button>
                <button className="buy-item" onClick={() => { setShowBuyMenu(false); navigate("/search"); }}>
                  Search by numbers
                </button>
              </div>
            )}
          </div>

          <a href="#" className="cat">
            Auction <span className="count"></span> <span className="caret"></span>
          </a>

          <div className="cat-wrapper" ref={filterRef}>
            <button
              className={`cat filter-toggle ${showFilters ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilters((prev) => !prev);
              }}
              aria-haspopup="true"
              aria-expanded={showFilters}
            >
              Filter <span className="caret"></span>
            </button>
          </div>
        </nav>

        <div className="ea-actions">
          <button className="search-btn" aria-label="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 21l-4.35-4.35"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="outline-btn" onClick={() => navigate("/register")}>
            Create Account
          </button>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="ea-filter-wrap" onClick={(e) => e.stopPropagation()}>
          <div className="ea-filter-box">
            <div className="ea-filter-row">
              <select>
                <option value="">Plate Type</option>
                <option value="VIP">VIP</option>
                <option value="Fancy">Fancy</option>
              </select>

              <select>
                <option value="">Digits</option>
                <option value="4">4 Digits</option>
              </select>

              <select>
                <option value="">State</option>
                <option value="AB">AB</option>
                <option value="CD">CD</option>
              </select>

              <input type="text" placeholder="Search plate number..." />
              <button className="ea-clear">Clear</button>
            </div>

            <div className="ea-sort-row">
              <select>
                <option value="endingSoon">Sort: Ending Soon</option>
                <option value="highestBid">Sort: Highest Price</option>
                <option value="mostBids">Sort: Most Bids</option>
              </select>
              <div className="ea-watch">
                Watchlist: <b>0</b>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
