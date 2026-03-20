import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { auctionService } from "../services/auctionService";
import { useNotification } from "../context/NotificationContext";
import { Button } from "../components/common/Button";
import { downloadBlob } from "../utils/csvExport";

const colors = ["#0066ff", "#00a883", "#f59f00"];

export const AdminDashboardPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [form, setForm] = useState({
    number: "",
    type: "Fancy",
    price: "",
    status: "upcoming",
    endTime: "",
    featured: false,
  });
  const { pushToast } = useNotification();

  const loadAuctions = useCallback(
    () =>
      auctionService
        .getAuctions()
        .then((data) => setAuctions(data.auctions || []))
        .catch((error) => {
          setAuctions([]);
          pushToast({ type: "error", title: "Load failed", message: error.message });
        }),
    [pushToast]
  );

  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  const cards = useMemo(() => {
    const ongoing = auctions.filter((x) => x.status === "ongoing").length;
    const upcoming = auctions.filter((x) => x.status === "upcoming").length;
    const completed = auctions.filter((x) => x.status === "completed").length;
    return [
      { label: "Total Auctions", value: auctions.length },
      { label: "Ongoing", value: ongoing },
      { label: "Upcoming", value: upcoming },
      { label: "Completed", value: completed },
    ];
  }, [auctions]);

  const typeChart = useMemo(() => {
    const map = auctions.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
  }, [auctions]);

  const statusChart = [
    { name: "ongoing", count: cards[1]?.value || 0 },
    { name: "upcoming", count: cards[2]?.value || 0 },
    { name: "completed", count: cards[3]?.value || 0 },
  ];

  const submitAuction = async (event) => {
    event.preventDefault();
    try {
      await auctionService.createAuction({
        ...form,
        price: Number(form.price),
        featured: Boolean(form.featured),
      });
      pushToast({ type: "success", title: "Auction created", message: "New auction listed." });
      setForm({ number: "", type: "Fancy", price: "", status: "upcoming", endTime: "", featured: false });
      await loadAuctions();
    } catch (error) {
      pushToast({ type: "error", title: "Create failed", message: error.message });
    }
  };

  const updateStatus = async (id, status) => {
    await auctionService.updateStatus(id, status);
    await loadAuctions();
  };

  const removeAuction = async (id) => {
    await auctionService.deleteAuction(id);
    await loadAuctions();
  };

  const exportCsv = async () => {
    const blob = await auctionService.exportCsv();
    downloadBlob(blob, "auctions-export.csv");
    pushToast({ type: "success", title: "Exported", message: "CSV export downloaded." });
  };

  return (
    <main className="page section">
      <div className="section-head">
        <h1>Admin Dashboard</h1>
        <Button onClick={exportCsv}>Export CSV</Button>
      </div>

      <div className="stats-grid cards-4">
        {cards.map((card) => (
          <article key={card.label}>
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </article>
        ))}
      </div>

      <section className="chart-grid">
        <article className="detail-panel">
          <h3>Auctions by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0066ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <article className="detail-panel">
          <h3>Auctions by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={typeChart} dataKey="value" nameKey="name" outerRadius={90}>
                {typeChart.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </section>

      <form className="list-card admin-form" onSubmit={submitAuction}>
        <h3>Create Auction</h3>
        <input
          placeholder="Plate (e.g. MH 01 AB 0001)"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value.toUpperCase() })}
          required
        />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="Fancy">Fancy</option>
          <option value="VIP">VIP</option>
          <option value="Trending">Trending</option>
          <option value="Normal">Normal</option>
          <option value="Cheap">Cheap</option>
        </select>
        <input type="number" placeholder="Starting price (INR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
        <label className="inline">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <Button type="submit">Create</Button>
      </form>

      <ul className="list-card">
        {auctions.map((auction) => (
          <li key={auction._id}>
            <div>
              <h3>
                {auction.number} <small>({auction.type})</small>
              </h3>
              <p>Status: {auction.status}</p>
            </div>
            <div className="row">
              <Button variant="ghost" onClick={() => updateStatus(auction._id, "ongoing")}>
                Ongoing
              </Button>
              <Button variant="ghost" onClick={() => updateStatus(auction._id, "completed")}>
                Complete
              </Button>
              <Button variant="danger" onClick={() => removeAuction(auction._id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};
