import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { auctionService } from "../services/auctionService";
import { bidService } from "../services/bidService";
import { formatCurrency } from "../utils/formatters";
import { useCountdown } from "../hooks/useCountdown";
import { useNotification } from "../context/NotificationContext";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { BidHistoryList } from "../components/auction/BidHistoryList";

export const AuctionDetailsPage = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [tickBids, setTickBids] = useState(0);
  const { pushToast } = useNotification();

  const load = useCallback(
    () =>
    Promise.all([auctionService.getById(id), bidService.getHistory(id)]).then(([auctionData, bidData]) => {
      setAuction(auctionData);
      setBids(bidData.bids || []);
      setTickBids((bidData.bids || []).length);
    }),
    [id]
  );

  useEffect(() => {
    load()
      .catch((error) => {
        pushToast({ type: "error", title: "Load failed", message: error.message });
      })
      .finally(() => setLoading(false));
  }, [load, pushToast]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickBids((prev) => prev + (Math.random() > 0.75 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { label } = useCountdown(auction?.endTime);

  const minBid = useMemo(() => Number(auction?.price || 0) + 1, [auction]);

  const submitBid = async (event) => {
    event.preventDefault();
    try {
      await bidService.placeBid({ auctionId: id, amount: Number(amount) });
      pushToast({ type: "success", title: "Bid placed", message: "Your bid has been recorded." });
      setAmount("");
      await load();
    } catch (error) {
      pushToast({ type: "error", title: "Bid failed", message: error.message });
    }
  };

  if (loading) return <Loader label="Loading auction..." />;
  if (!auction) return <p className="page">Auction not found.</p>;
  if (auction.status === "completed") return <p className="page">This number plate is sold and no longer available.</p>;

  return (
    <main className="page section">
      <div className="auction-detail-grid">
        <article className="detail-panel">
          <h1>{auction.number}</h1>
          <p className="price">{formatCurrency(auction.price)}</p>
          <p className="muted">Ends in {label}</p>
          <p>
            Top bidder: <strong>{auction.topBidder?.name || "No bidder yet"}</strong>
          </p>
          <motion.p key={tickBids} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="muted">
            Live bid counter: {tickBids}
          </motion.p>
        </article>

        <form className="detail-panel" onSubmit={submitBid}>
          <h2>Place Bid</h2>
          <input
            type="number"
            min={minBid}
            placeholder={`Minimum ${minBid}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Button type="submit">Submit Bid</Button>
        </form>
      </div>
      <section className="section">
        <h2>Bid History</h2>
        <BidHistoryList bids={bids} />
      </section>
    </main>
  );
};
