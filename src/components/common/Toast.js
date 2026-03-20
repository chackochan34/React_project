import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotification } from "../../context/NotificationContext";

export const ToastContainer = () => {
  const { toasts, dismissToast } = useNotification();

  useEffect(() => {
    const timers = toasts.map((toast) => setTimeout(() => dismissToast(toast.id), toast.duration));
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, dismissToast]);

  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <strong>{toast.title || "Notice"}</strong>
            <p>{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
