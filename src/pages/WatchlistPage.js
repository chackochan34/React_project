import { useMemo } from "react";
import { useWatchlist } from "../context/WatchlistContext";
import { AuctionCard } from "../components/auction/AuctionCard";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";

const isValidWatchlistAuction = (auction) => {
  const auctionId = auction?._id || auction?.id;
  return Boolean(auctionId && auction?.type && auction?.number && auction?.endTime);
};

export const WatchlistPage = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  const validWatchlist = useMemo(() => watchlist.filter(isValidWatchlistAuction), [watchlist]);

  return (
    <main className="page section">
      <div className="section-head">
        <h1>Watchlist</h1>
        {!!validWatchlist.length && (
          <Button variant="ghost" onClick={clearWatchlist}>
            Clear
          </Button>
        )}
      </div>
      {!validWatchlist.length ? (
        <EmptyState title="No watched auctions" subtitle="Bookmark an auction to track it here." />
      ) : (
        <section className="grid">
          {validWatchlist.map((auction) => (
            <AuctionCard key={auction._id || auction.id} auction={auction} />
          ))}
        </section>
      )}
    </main>
  );
};
