import { useEffect, useState } from "react";
import { bidService } from "../services/bidService";
import { Loader } from "../components/common/Loader";
import { EmptyState } from "../components/common/EmptyState";
import { formatCurrency, formatDateTime } from "../utils/formatters";

export const MyBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bidService
      .getMyBids()
      .then((data) => setBids((data.bids || []).filter((bid) => bid?.auction?.status !== "completed")))
      .catch(() => setBids([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Fetching your bids..." />;
  if (!bids.length) return <EmptyState title="No active bids yet" subtitle="Your active bidding activity will appear here." />;

  return (
    <main className="page section">
      <h1>My Active Bids</h1>
      <ul className="list-card">
        {bids.map((bid) => (
          <li key={bid._id}>
            <div>
              <h3>{bid.auction?.number}</h3>
              <p>{formatDateTime(bid.createdAt)}</p>
            </div>
            <strong>{formatCurrency(bid.amount)}</strong>
          </li>
        ))}
      </ul>
    </main>
  );
};
