import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>About PLATES</h1>

        <h2>Number Plate Auctions — How it works</h2>
        <p>
          PLATES runs periodic auctions for exclusive vehicle registration
          numbers. Numbers are grouped by type (VIP, Fancy, Standard) and by state.
          Each listing opens for bidding with a starting price and a scheduled
          closing time. Registered users can place bids, monitor auctions, and
          add plates to a watchlist.
        </p>

        <h3>Placing bids</h3>
        <p>
          To place a bid you must have an account. Bids must follow the minimum
          increment rules shown on each listing. If you win, you will receive
          instructions to complete payment and transfer the plate to your name.
        </p>

        <h3>Types of plates</h3>
        <ul>
          <li><strong>VIP:</strong> Short, unique numbers — typically the most valuable.</li>
          <li><strong>Fancy:</strong> Patterns or repeated digits that attract bidders.</li>
          <li><strong>Standard:</strong> Regular plate numbers available at lower starting prices.</li>
        </ul>

        <h3>Tips for bidders</h3>
        <ul>
          <li>Use the watchlist to follow plates you're interested in.</li>
          <li>Set your maximum bid in advance and monitor closing minutes.</li>
          <li>Review verification and payment steps before bidding.</li>
        </ul>

        <p className="about-note">
          For more information, contact our support or check the Auction Calendar
          for upcoming sales.
        </p>
      </div>
    </div>
  );
}
