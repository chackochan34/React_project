import { createContext, useCallback, useContext, useMemo, useState } from "react";

const WatchlistContext = createContext(null);

const getAuctionId = (auction) => auction?._id || auction?.id || null;

const loadInitialWatchlist = () => {
  try {
    const saved = localStorage.getItem("watchlist");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(loadInitialWatchlist);

  const persist = useCallback((next) => {
    setWatchlist(next);
    localStorage.setItem("watchlist", JSON.stringify(next));
  }, []);

  const toggleWatch = useCallback(
    (auction) => {
      const auctionId = getAuctionId(auction);
      if (!auctionId) return false;

      const exists = watchlist.some((item) => getAuctionId(item) === auctionId);
      const next = exists
        ? watchlist.filter((item) => getAuctionId(item) !== auctionId)
        : [...watchlist, auction];

      persist(next);
      return !exists;
    },
    [watchlist, persist]
  );

  const clearWatchlist = useCallback(() => persist([]), [persist]);
  const isWatched = useCallback((id) => watchlist.some((item) => getAuctionId(item) === id), [watchlist]);

  const value = useMemo(
    () => ({
      watchlist,
      toggleWatch,
      clearWatchlist,
      isWatched,
    }),
    [watchlist, toggleWatch, clearWatchlist, isWatched]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export const useWatchlist = () => useContext(WatchlistContext);
