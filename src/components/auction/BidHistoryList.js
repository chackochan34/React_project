import { formatCurrency, formatDateTime } from "../../utils/formatters";

export const BidHistoryList = ({ bids = [] }) => {
  if (!bids.length) return <p className="muted">No bids yet.</p>;
  return (
    <ul className="bid-history">
      {bids.map((bid) => (
        <li key={bid._id}>
          <div>
            <strong>{bid.user?.name || "Bidder"}</strong>
            <p>{formatDateTime(bid.timestamp || bid.createdAt)}</p>
          </div>
          <span>{formatCurrency(bid.amount)}</span>
        </li>
      ))}
    </ul>
  );
};
