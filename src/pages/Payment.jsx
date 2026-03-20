import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { paymentService } from "../services/paymentService";
import { bidService } from "../services/bidService";
import { auctionService } from "../services/auctionService";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { useNotification } from "../context/NotificationContext";
import "../styles/payment.css";

const METHOD_OPTIONS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Debit/Credit Card" },
  { id: "netbanking", label: "Net Banking" },
];

const BANK_OPTIONS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

const STATUS_META = {
  pending: { label: "Pending", tone: "pending" },
  processing: { label: "Processing", tone: "processing" },
  success: { label: "Success", tone: "success" },
  failed: { label: "Failed", tone: "failed" },
  refunded: { label: "Refunded", tone: "refunded" },
};

const STEP_LABELS = ["Auction Won", "Payment", "Confirmation"];

const isObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const buildOrder = (state) => {
  const winningAmount = Number(state?.winningAmount ?? state?.amount ?? 95000);

  return {
    plateNumber: state?.plateNumber || state?.number || "MH01AA0001",
    winningAmount,
    orderId: state?.orderId || `ORD-${Date.now().toString().slice(-7)}`,
    auctionId: state?.auctionId || "",
    paymentDeadline: state?.paymentDeadline || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };
};

export const Payment = () => {
  const { state } = useLocation();
  const { pushToast } = useNotification();

  const order = useMemo(() => buildOrder(state), [state]);

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [availableBids, setAvailableBids] = useState([]);
  const [availableAuctions, setAvailableAuctions] = useState([]);
  const [linkedAuctionId, setLinkedAuctionId] = useState(isObjectId(order.auctionId) ? order.auctionId : "");

  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({ cardNumber: "", expiryDate: "", cvv: "", nameOnCard: "" });
  const [selectedBank, setSelectedBank] = useState("");

  const stepIndex = paymentStatus === "success" || paymentStatus === "refunded" ? 2 : 1;
  const selectedBid = useMemo(
    () => availableBids.find((bid) => bid.auction?._id === linkedAuctionId) || null,
    [availableBids, linkedAuctionId]
  );
  const selectedAuction = useMemo(
    () => availableAuctions.find((auction) => auction?._id === linkedAuctionId) || null,
    [availableAuctions, linkedAuctionId]
  );
  const winningAmount = selectedBid
    ? Number(selectedBid.amount || 0)
    : selectedAuction
    ? Number(selectedAuction.price || 0)
    : order.winningAmount;
  const platformFee = Math.round(winningAmount * 0.015);
  const taxAmount = Math.round(platformFee * 0.18);
  const payableAmount = winningAmount + platformFee + taxAmount;

  useEffect(() => {
    Promise.allSettled([
      bidService.getMyBids(),
      auctionService.getAuctions({ sort: "endTime", limit: 100 }),
    ]).then(([bidsResult, auctionsResult]) => {
      const bids =
        bidsResult.status === "fulfilled"
          ? (bidsResult.value?.bids || []).filter((bid) => isObjectId(bid?.auction?._id))
          : [];
      const auctions =
        auctionsResult.status === "fulfilled"
          ? (auctionsResult.value?.auctions || []).filter((auction) => isObjectId(auction?._id) && auction.status !== "completed")
          : [];

      setAvailableBids(bids);
      setAvailableAuctions(auctions);

      if (!linkedAuctionId) {
        if (isObjectId(order.auctionId) && auctions.some((auction) => auction._id === order.auctionId)) {
          setLinkedAuctionId(order.auctionId);
          return;
        }
        if (bids.length && auctions.some((auction) => auction._id === bids[0].auction._id)) {
          setLinkedAuctionId(bids[0].auction._id);
          return;
        }
        if (auctions.length) {
          setLinkedAuctionId(auctions[0]._id);
        }
      }
    });
  }, [linkedAuctionId, order.auctionId]);

  const simulateGateway = async (forcedStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 1400));

    let response;
    try {
      response = await paymentService.mockPay({
        auctionId: linkedAuctionId,
        amount: payableAmount,
        paymentMethod,
        forceStatus: forcedStatus,
      });
    } catch (error) {
      const fallbackAuctionId = availableAuctions[0]?._id || availableBids[0]?.auction?._id;
      const isMissingAuction = /auction not found/i.test(error?.message || "");
      if (isMissingAuction && isObjectId(fallbackAuctionId) && fallbackAuctionId !== linkedAuctionId) {
        setLinkedAuctionId(fallbackAuctionId);
        response = await paymentService.mockPay({
          auctionId: fallbackAuctionId,
          amount: payableAmount,
          paymentMethod,
          forceStatus: forcedStatus,
        });
      } else {
        throw error;
      }
    }

    return {
      status: response?.transaction?.status === "success" ? "success" : "failed",
      referenceId: response?.transaction?.referenceId || `TXN-${Date.now()}`,
      createdAt: response?.transaction?.createdAt || new Date().toISOString(),
    };
  };

  const handlePayNow = async (event) => {
    event.preventDefault();
    if (!isObjectId(linkedAuctionId)) {
      pushToast({ type: "error", title: "Select auction", message: "Choose a valid auction before payment." });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      const result = await simulateGateway("success");
      setPaymentStatus(result.status);
      setTransaction({
        referenceId: result.referenceId,
        amount: payableAmount,
        paidAt: result.createdAt,
      });

      if (result.status === "success") {
        pushToast({ type: "success", title: "Payment complete", message: "Your winning plate is now confirmed." });
      } else {
        pushToast({ type: "error", title: "Payment failed", message: "Gateway declined this transaction." });
      }
    } catch (error) {
      setPaymentStatus("failed");
      setTransaction(null);
      pushToast({ type: "error", title: "Payment failed", message: error.message || "Unable to process payment." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFailDemo = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      const result = await simulateGateway("failed");
      setPaymentStatus("failed");
      setTransaction({
        referenceId: result.referenceId,
        amount: payableAmount,
        paidAt: result.createdAt,
      });
      pushToast({ type: "error", title: "Demo failure", message: "Payment marked as failed." });
    } catch (error) {
      setPaymentStatus("failed");
      pushToast({ type: "error", title: "Payment failed", message: error.message || "Unable to process payment." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefund = () => {
    if (!transaction || paymentStatus !== "success") {
      pushToast({ type: "error", title: "Refund unavailable", message: "Refund is available only after a successful payment." });
      return;
    }

    setPaymentStatus("refunded");
    pushToast({ type: "success", title: "Refund requested", message: "Refund request created for this transaction." });
  };

  const renderMethodForm = () => {
    if (paymentMethod === "upi") {
      return (
        <div className="pgw-form-grid">
          <label className="pgw-field">
            <span>UPI ID</span>
            <input value={upiId} onChange={(event) => setUpiId(event.target.value)} type="text" placeholder="name@bank" autoComplete="off" />
          </label>
        </div>
      );
    }

    if (paymentMethod === "card") {
      return (
        <div className="pgw-form-grid">
          <label className="pgw-field pgw-field-full">
            <span>Card Number</span>
            <input
              value={cardData.cardNumber}
              onChange={(event) => setCardData({ ...cardData, cardNumber: event.target.value })}
              type="text"
              placeholder="1234 5678 9012 3456"
              autoComplete="cc-number"
            />
          </label>
          <label className="pgw-field">
            <span>Expiry Date</span>
            <input
              value={cardData.expiryDate}
              onChange={(event) => setCardData({ ...cardData, expiryDate: event.target.value })}
              type="text"
              placeholder="MM/YY"
              autoComplete="cc-exp"
            />
          </label>
          <label className="pgw-field">
            <span>CVV</span>
            <input
              value={cardData.cvv}
              onChange={(event) => setCardData({ ...cardData, cvv: event.target.value })}
              type="password"
              placeholder="123"
              autoComplete="cc-csc"
            />
          </label>
          <label className="pgw-field pgw-field-full">
            <span>Name on Card</span>
            <input
              value={cardData.nameOnCard}
              onChange={(event) => setCardData({ ...cardData, nameOnCard: event.target.value })}
              type="text"
              placeholder="Card holder name"
              autoComplete="cc-name"
            />
          </label>
        </div>
      );
    }

    return (
      <div className="pgw-form-grid">
        <label className="pgw-field">
          <span>Select Bank</span>
          <select value={selectedBank} onChange={(event) => setSelectedBank(event.target.value)}>
            <option value="">Choose your bank</option>
            {BANK_OPTIONS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  };

  const statusInfo = STATUS_META[paymentStatus] || STATUS_META.pending;
  const auctionOptions = useMemo(() => {
    const activeAuctionIds = new Set(availableAuctions.map((auction) => auction._id));
    const fromBids = availableBids
      .filter((bid) => activeAuctionIds.has(bid.auction._id))
      .map((bid) => ({
      value: bid.auction._id,
      label: `${bid.auction.number} - ${formatCurrency(Number(bid.amount || 0))}`,
    }));

    const bidIds = new Set(fromBids.map((item) => item.value));
    const fromAuctions = availableAuctions
      .filter((auction) => !bidIds.has(auction._id))
      .map((auction) => ({
        value: auction._id,
        label: `${auction.number} - ${formatCurrency(Number(auction.price || 0))}`,
      }));

    return [...fromBids, ...fromAuctions];
  }, [availableBids, availableAuctions]);

  return (
    <main className="page section pgw-page">
      <section className="pgw-header">
        <p className="pgw-kicker">Secure checkout</p>
        <h1>Payment Gateway</h1>
        <p>Complete payment to confirm your winning plate</p>
      </section>

      <section className="pgw-stepper" aria-label="Payment progress">
        {STEP_LABELS.map((label, index) => {
          const isDone = index < stepIndex;
          const isActive = index === stepIndex;
          return (
            <article key={label} className={`pgw-step ${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}`}>
              <span>{index + 1}</span>
              <strong>{label}</strong>
            </article>
          );
        })}
      </section>

      <section className="pgw-shell">
        <article className="pgw-card">
          <header className="pgw-card-head">
            <h2>Order Summary</h2>
          </header>
          <dl className="pgw-meta-list">
            <div><dt>Plate Number</dt><dd>{selectedBid?.auction?.number || selectedAuction?.number || order.plateNumber}</dd></div>
            <div><dt>Winning Amount</dt><dd>{formatCurrency(winningAmount)}</dd></div>
            <div><dt>Order ID</dt><dd>{order.orderId}</dd></div>
            <div><dt>Auction ID</dt><dd>{linkedAuctionId || "Not selected"}</dd></div>
            <div><dt>Payment Deadline</dt><dd>{order.paymentDeadline ? formatDateTime(order.paymentDeadline) : "Not specified"}</dd></div>
          </dl>
        </article>

        <article className="pgw-card">
          <header className="pgw-card-head">
            <h2>Payment Method</h2>
          </header>
          <div className="pgw-method-tabs" role="tablist" aria-label="Payment methods">
            {METHOD_OPTIONS.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`pgw-method-tab ${paymentMethod === method.id ? "is-selected" : ""}`}
                onClick={() => setPaymentMethod(method.id)}
              >
                {method.label}
              </button>
            ))}
          </div>

          <form className="pgw-form" onSubmit={handlePayNow}>
            <div className="pgw-form-grid">
              <label className="pgw-field pgw-field-full">
                <span>Select Auction</span>
                <select value={linkedAuctionId} onChange={(event) => setLinkedAuctionId(event.target.value)}>
                  <option value="">Choose auction</option>
                  {auctionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {renderMethodForm()}

            <section className="pgw-trust">
              <h3>Trust & Security</h3>
              <ul>
                <li><span>🔒</span> Secure Payment</li>
                <li><span>✔</span> Encrypted Transaction</li>
                <li><span>✔</span> Safe Checkout</li>
              </ul>
            </section>

            <div className="pgw-action-row">
              <button type="submit" className="pgw-btn pgw-btn-primary" disabled={isProcessing}>
                {isProcessing ? (
                  <span className="pgw-spinner-wrap"><span className="pgw-spinner" /> Processing...</span>
                ) : "Pay Now"}
              </button>
              <button type="button" className="pgw-btn pgw-btn-muted" onClick={handleFailDemo} disabled={isProcessing}>
                Fail Payment
              </button>
              <button type="button" className="pgw-btn pgw-btn-ghost" onClick={handleRefund} disabled={isProcessing}>
                Request Refund
              </button>
            </div>
          </form>
        </article>

        <article className="pgw-card">
          <header className="pgw-card-head"><h2>Price Breakdown</h2></header>
          <ul className="pgw-price-list">
            <li><span>Winning Amount</span><strong>{formatCurrency(winningAmount)}</strong></li>
            <li><span>Platform Fee</span><strong>{formatCurrency(platformFee)}</strong></li>
            <li><span>GST / Tax</span><strong>{formatCurrency(taxAmount)}</strong></li>
            <li className="pgw-price-total"><span>Total Payable</span><strong>{formatCurrency(payableAmount)}</strong></li>
          </ul>
        </article>

        <article className="pgw-card">
          <header className="pgw-card-head"><h2>Payment Status</h2></header>
          <div className={`pgw-status pgw-status-${statusInfo.tone}`}>
            <span className="pgw-status-dot" />
            <strong>{statusInfo.label}</strong>
          </div>
          <p className="pgw-status-copy">
            {paymentStatus === "pending" && "Awaiting payment confirmation for your winning plate."}
            {paymentStatus === "processing" && "We are securely processing your transaction. Please wait."}
            {paymentStatus === "success" && "Payment received successfully. Plate confirmation completed."}
            {paymentStatus === "failed" && "Payment could not be completed. Please retry or switch method."}
            {paymentStatus === "refunded" && "Refund request accepted and marked for processing."}
          </p>
          {transaction?.referenceId ? (
            <p className="pgw-transaction-id">Transaction ID: <code>{transaction.referenceId}</code></p>
          ) : null}
        </article>
      </section>

      {paymentStatus === "success" && transaction ? (
        <section className="pgw-receipt">
          <div>
            <p className="pgw-receipt-pill">Payment Successful</p>
            <h2>Plate Confirmed</h2>
            <p>Your payment has been validated and your plate booking is now confirmed.</p>
          </div>
          <dl>
            <div><dt>Amount Paid</dt><dd>{formatCurrency(transaction.amount)}</dd></div>
            <div><dt>Transaction ID</dt><dd>{transaction.referenceId}</dd></div>
            <div><dt>Date & Time</dt><dd>{formatDateTime(transaction.paidAt)}</dd></div>
          </dl>
          <button type="button" className="pgw-btn pgw-btn-primary" onClick={() => window.print()}>
            Download Receipt
          </button>
        </section>
      ) : null}
    </main>
  );
};
