import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

function loadAuctions() {
  const saved = JSON.parse(localStorage.getItem("admin_auctions")) || [];
  if (saved.length === 0) {
    return [
      {
        id: 1,
        number: "KL 07 AB 0001",
        type: "VIP",
        price: 250000,
        bids: 140,
        status: "ongoing",
      },
      {
        id: 2,
        number: "KL 01 AA 9999",
        type: "Fancy",
        price: 410000,
        bids: 260,
        status: "upcoming",
      },
      {
        id: 3,
        number: "TN 09 ZZ 0007",
        type: "VIP",
        price: 180000,
        bids: 90,
        status: "completed",
      },
    ];
  }
  return saved;
}

function AdminDashboard() {
  const [auctions, setAuctions] = useState(loadAuctions());

  const [form, setForm] = useState({
    number: "",
    type: "VIP",
    price: "",
    status: "ongoing",
  });

  useEffect(() => {
    localStorage.setItem("admin_auctions", JSON.stringify(auctions));
  }, [auctions]);

  const analytics = useMemo(() => {
    const total = auctions.length;
    const ongoing = auctions.filter((a) => a.status === "ongoing").length;
    const completed = auctions.filter((a) => a.status === "completed").length;
    const totalBids = auctions.reduce((sum, a) => sum + (a.bids || 0), 0);
    const highest = Math.max(...auctions.map((a) => a.price || 0));
    return { total, ongoing, completed, totalBids, highest };
  }, [auctions]);

  const addAuction = () => {
    if (!form.number || !form.price) {
      alert("Enter plate number and starting price");
      return;
    }

    const newAuction = {
      id: Date.now(),
      number: form.number.toUpperCase(),
      type: form.type,
      price: Number(form.price),
      bids: Math.floor(10 + Math.random() * 120),
      status: form.status,
    };

    setAuctions([newAuction, ...auctions]);
    setForm({ number: "", type: "VIP", price: "", status: "ongoing" });
  };

  const deleteAuction = (id) => {
    setAuctions(auctions.filter((a) => a.id !== id));
  };

  const updateStatus = (id, status) => {
    setAuctions(
      auctions.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Plate", "Type", "Price", "Bids", "Status"],
      ...auctions.map((a) => [a.id, a.number, a.type, a.price, a.bids, a.status]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "auction_report.csv";
    a.click();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <p>Manage auctions, users (mock), and generate reports</p>
      </div>

      {/* analytics */}
      <div className="admin-cards">
        <div className="a-card">
          <span>Total Auctions</span>
          <h3>{analytics.total}</h3>
        </div>
        <div className="a-card">
          <span>Ongoing</span>
          <h3>{analytics.ongoing}</h3>
        </div>
        <div className="a-card">
          <span>Completed</span>
          <h3>{analytics.completed}</h3>
        </div>
        <div className="a-card">
          <span>Total Bids</span>
          <h3>{analytics.totalBids}</h3>
        </div>
        <div className="a-card">
          <span>Highest Bid</span>
          <h3>₹{analytics.highest.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      {/* create auction */}
      <div className="admin-create">
        <h3>Create Auction</h3>

        <div className="create-grid">
          <input
            placeholder="Plate Number (KL 07 AB 9999)"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>VIP</option>
            <option>Fancy</option>
          </select>

          <input
            type="number"
            placeholder="Starting Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="ongoing">ongoing</option>
            <option value="upcoming">upcoming</option>
            <option value="completed">completed</option>
          </select>

          <button onClick={addAuction}>Add Auction</button>
          <button className="export" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {/* auctions table */}
      <div className="admin-table-wrap">
        <h3>Live Auction Monitor</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Plate</th>
              <th>Type</th>
              <th>Price</th>
              <th>Bids</th>
              <th>Status</th>
              <th>Admin Action</th>
            </tr>
          </thead>

          <tbody>
            {auctions.map((a) => (
              <tr key={a.id}>
                <td className="plate">{a.number}</td>
                <td>{a.type}</td>
                <td>₹{a.price.toLocaleString("en-IN")}</td>
                <td>{a.bids}</td>
                <td>
                  <select
                    className="status-select"
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                  >
                    <option value="ongoing">ongoing</option>
                    <option value="upcoming">upcoming</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
                <td>
                  <button className="del" onClick={() => deleteAuction(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="note">
          ✅ Users / blocking is mock (frontend-only). Report export works.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
