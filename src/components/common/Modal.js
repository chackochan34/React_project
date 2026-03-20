import { Button } from "./Button";

export const Modal = ({ open, title, children, onClose, onConfirm, confirmLabel = "Confirm" }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{title}</h3>
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};
