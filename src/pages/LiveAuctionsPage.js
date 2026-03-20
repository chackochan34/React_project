import { useEffect, useMemo, useState } from "react";
import { auctionService } from "../services/auctionService";
import { AuctionCard } from "../components/auction/AuctionCard";
import { Loader } from "../components/common/Loader";
import { EmptyState } from "../components/common/EmptyState";

const defaultFilters = { search: "", category: "all", status: "all", sort: "-createdAt" };

export const LiveAuctionsPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category !== "all") params.type = filters.category;
    if (filters.status !== "all") params.status = filters.status;
    params.sort = filters.sort;

    setLoading(true);
    auctionService
      .getAuctions(params)
      .then((data) => {
        const list = data.auctions || [];
        setAuctions(list.filter((auction) => auction?.status !== "completed"));
      })
      .catch(() => setAuctions([]))
      .finally(() => setLoading(false));
  }, [filters]);

  const summary = useMemo(
    () => `Showing ${auctions.length} auctions${filters.category !== "all" ? ` in ${filters.category}` : ""}.`,
    [auctions.length, filters.category]
  );

  return (
    <main className="page">
      <section className="section">
        <h1>Live Auctions</h1>
        <p className="muted">{summary}</p>
        <div className="toolbar">
          <input
            placeholder="Search by plate (e.g. MH 01)"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
          <select value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>
            <option value="all">All Categories</option>
            <option value="Fancy">Fancy</option>
            <option value="VIP">VIP</option>
            <option value="Trending">Trending</option>
            <option value="Normal">Normal</option>
            <option value="Cheap">Cheap</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select value={filters.sort} onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}>
            <option value="-createdAt">Newest</option>
            <option value="price">Price Low to High</option>
            <option value="-price">Price High to Low</option>
            <option value="endTime">Ending Soon</option>
          </select>
        </div>
      </section>

      {loading ? (
        <Loader label="Loading auctions..." />
      ) : auctions.length ? (
        <section className="grid section">
          {auctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </section>
      ) : (
        <EmptyState title="No auctions found" subtitle="Try removing a filter or searching with another number." />
      )}
    </main>
  );
};
