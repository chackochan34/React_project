import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auctionService } from "../services/auctionService";
import { AuctionCard } from "../components/auction/AuctionCard";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { EmptyState } from "../components/common/EmptyState";

export const HomePage = () => {
  const [ongoing, setOngoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      auctionService.getAuctions({ status: "ongoing", sort: "endTime", limit: 8 }),
      auctionService.getAuctions({ status: "upcoming", sort: "endTime", limit: 8 }),
    ])
      .then(([ongoingData, upcomingData]) => {
        setOngoing(ongoingData.auctions || []);
        setIncoming(upcomingData.auctions || []);
      })
      .catch(() => {
        setOngoing([]);
        setIncoming([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <h1>Bid elite numbers in real-time.</h1>
          <p>Premium-grade auctions for Fancy, VIP and Trending number plates.</p>
          <Link to="/live-auctions" className="btn btn-primary">
            Explore live auctions
          </Link>
        </div>
        <div className="stats-grid">
          {[
            { label: "Live Auctions", value: "120+" },
            { label: "Active Bidders", value: "3.8K" },
            { label: "Successful Deals", value: "24K+" },
          ].map((item) => (
            <article key={item.label}>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Ongoing Number Plates</h2>
          <Link to="/live-auctions">View all</Link>
        </div>
        {loading ? (
          <div className="grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`ongoing-sk-${index}`} />
            ))}
          </div>
        ) : ongoing.length ? (
          <div className="grid">
            {ongoing.slice(0, 4).map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        ) : (
          <EmptyState title="No ongoing plates" subtitle="New live plates will appear here." />
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Incoming Number Plates</h2>
          <Link to="/live-auctions">View all</Link>
        </div>
        {loading ? (
          <div className="grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`incoming-sk-${index}`} />
            ))}
          </div>
        ) : incoming.length ? (
          <div className="grid">
            {incoming.slice(0, 4).map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        ) : (
          <EmptyState title="No incoming plates" subtitle="Upcoming plates will appear here." />
        )}
      </section>
    </main>
  );
};
