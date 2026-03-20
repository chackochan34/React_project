import { useEffect, useMemo, useState } from "react";

export const useCountdown = (endTime) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const end = new Date(endTime).getTime();
    const diff = Math.max(end - now, 0);
    const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const mins = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const secs = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
    return { diff, label: `${hrs}:${mins}:${secs}` };
  }, [endTime, now]);
};
