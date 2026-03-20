import { Link } from "react-router-dom";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useCountdown } from "../../hooks/useCountdown";
import { formatCurrency } from "../../utils/formatters";
import { useWatchlist } from "../../context/WatchlistContext";

const getAuctionId = (auction) => auction?._id || auction?.id || null;

export const AuctionCard = ({ auction }) => {
  const { diff, label } = useCountdown(auction?.endTime);
  const { toggleWatch, isWatched } = useWatchlist();

  const auctionId = getAuctionId(auction);
  const safeType = typeof auction?.type === "string" ? auction.type : "Unknown";
  const watched = auctionId ? isWatched(auctionId) : false;
  const originalStatus = auction?.status || "unknown";
  const displayStatus = originalStatus === "ongoing" && diff === 0 ? "completed" : originalStatus;

  return (
    <article className="auction-card">
      <div className="auction-card-head">
        <span className={`chip chip-${safeType.toLowerCase()}`}>{safeType}</span>
        <button className="icon-btn" onClick={() => toggleWatch(auction)} type="button" aria-label="Toggle watch">
          {watched ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
      <h3>{auction?.number || "N/A"}</h3>
      <p className="price">{formatCurrency(auction?.price || 0)}</p>
      <p className="muted">{displayStatus === "completed" ? "Auction ended" : `Ends in ${label}`}</p>
      <div className="auction-card-foot">
        <span className={`status ${displayStatus}`}>{displayStatus}</span>
        {auctionId ? <Link to={`/auctions/${auctionId}`}>View Auction</Link> : <span>View Auction</span>}
      </div>
    </article>
  );
};
