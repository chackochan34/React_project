import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Mybids.css";

function getMyBids() {
  const saved = JSON.parse(localStorage.getItem("mybids")) || [];

  // If user has no bids yet, show sample
  if (saved.length === 0) {
    return [
      {
        id: 1,
        number: "KL 07 AB 0001",
        bidAmount: 250000,
        status: "Winning",
        time: "Today 11:10 AM",
      },
      {
        id: 2,
        number: "KL 01 AA 9999",
        bidAmount: 410000,
        status: "Outbid",
        time: "Today 10:25 AM",
      },
      {
        id: 3,
        number: "TN 09 ZZ 0007",
        bidAmount: 180000,
        status: "Won",
        time: "Yesterday 09:30 PM",
      },
    ];
  }
  return saved;
}

function MyBids() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All / Winning / Outbid / Won / Lost
  const [sort, setSort] = useState("Latest"); // Latest / Highest

  const bids = useMemo(() => getMyBids(), []);

  const filtered = useMemo(() => {
    let list = [...bids];

    // Search
    if (search.trim()) {
      list = list.filter((b) =>
        b.number.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter status
    if (filter !== "All") {
      list = list.filter((b) => b.status === filter);
    }

    // Sort
    if (sort === "Highest") {
      list.sort((a, b) => b.bidAmount - a.bidAmount);
    }

    return list;
  }, [bids, search, filter, sort]);

  // Summary
  const summary = useMemo(() => {
    const total = bids.length;
    const winning = bids.filter((b) => b.status === "Winning").length;
    const outbid = bids.filter((b) => b.status === "Outbid").length;
    const won = bids.filter((b) => b.status === "Won").length;

    return { total, winning, outbid, won };
  }, [bids]);

  return (
    <div className="mybids-page">
      <div className="mybids-header">
        <h2>My Bids</h2>
        <p>Track your bidding activity and status</p>
      </div>

      {/* Summary Cards */}
      <div className="mybids-summary">
        <div className="sum-card">
          <span>Total Bids</span>
          <h3>{summary.total}</h3>
        </div>
        <div className="sum-card green">
          <span>Winning</span>
          <h3>{summary.winning}</h3>
        </div>
        <div className="sum-card yellow">
          <span>Outbid</span>
          <h3>{summary.outbid}</h3>
        </div>
        <div className="sum-card blue">
          <span>Won</span>
          <h3>{summary.won}</h3>
        </div>
      </div>

      {/* Controls */}
      <div className="mybids-controls">
        <input
          type="text"
          placeholder="Search plate number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Winning</option>
          <option>Outbid</option>
          <option>Won</option>
          <option>Lost</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="Latest">Sort: Latest</option>
          <option value="Highest">Sort: Highest Bid</option>
        </select>
      </div>

      {/* Table */}
      <div className="mybids-table-wrap">
        <table className="mybids-table">
          <thead>
            <tr>
              <th>Plate</th>
              <th>Bid Amount</th>
              <th>Status</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No bids found
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className={b.status === "Winning" ? "row-win" : ""}>
                  <td className="plate">{b.number}</td>
                  <td className="amount">₹{b.bidAmount.toLocaleString("en-IN")}</td>

                  <td>
                    <span className={`status ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>

                  <td className="time">{b.time}</td>

                  <td>
                    <button
                      className="rebid-btn"
                      onClick={() => navigate(`/bidding/${b.id}`, { state: { id: b.id, number: b.number, price: b.bidAmount, time: 180 } })}
                    >
                      Re-bid
                    </button>

                    {b.status === "Won" && (
                      <button
                        className="pay-btn"
                        onClick={() =>
                          navigate("/payment", {
                            state: { plateNumber: b.number, amount: b.bidAmount },
                          })
                        }
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyBids;
