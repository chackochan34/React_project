import { useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { bidService } from "../../services/bidService";
import { formatCurrency } from "../../utils/formatters";

const POLL_INTERVAL_MS = 30000;

const getSeenKey = (userId) => `winner-notify-seen:${userId}`;

export const WinnerBidNotifier = () => {
  const { isAuthenticated, user } = useAuth();
  const { pushToast } = useNotification();
  const userId = useMemo(() => user?._id || "", [user]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return undefined;

    const key = getSeenKey(userId);

    const checkWins = async () => {
      try {
        const data = await bidService.getWinningBids();
        const wins = data?.bids || [];
        const rawSeen = localStorage.getItem(key);

        if (!rawSeen) {
          const baseline = wins
            .map((bid) => String(bid?.auction?._id || ""))
            .filter(Boolean);
          localStorage.setItem(key, JSON.stringify(baseline));
          return;
        }

        const seen = new Set(JSON.parse(rawSeen || "[]"));
        const unseenWins = wins.filter((bid) => !seen.has(String(bid.auction?._id || "")));

        unseenWins.forEach((bid) => {
          pushToast({
            type: "success",
            title: "Auction won",
            message: `You won ${bid.auction?.number} for ${formatCurrency(Number(bid.amount || 0))}.`,
            duration: 6000,
          });
        });

        const nextSeen = new Set(seen);
        wins.forEach((bid) => {
          if (bid?.auction?._id) nextSeen.add(String(bid.auction._id));
        });
        localStorage.setItem(key, JSON.stringify([...nextSeen]));
      } catch (_) {
        // Silent fail to avoid noisy UX while polling.
      }
    };

    checkWins();
    const interval = setInterval(checkWins, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAuthenticated, userId, pushToast]);

  return null;
};
