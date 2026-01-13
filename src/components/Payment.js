import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const { state } = useLocation();
  const plateNumber = state?.plateNumber || "KL 07 AB 0001";
  const winningAmount = state?.amount || 250000;

  const [method, setMethod] = useState("UPI");
  const [status, setStatus] = useState("Pending"); // Pending / Processing / Success / Failed
  const [txnId, setTxnId] = useState("");

  const breakdown = useMemo(() => {
    const platformFee = 199;
    const gst = Math.floor((winningAmount * 0.02)); // 2% mock GST
    const total = winningAmount + platformFee + gst;
    return { platformFee, gst, total };
  }, [winningAmount]);

  const payNow = () => {
    const id = "TXN" + Math.floor(100000 + Math.random() * 900000);
    setTxnId(id);
    setStatus("Processing");

    setTimeout(() => {
      setStatus("Success");
    }, 1500);
  };

  const failPayment = () => {
    const id = "TXN" + Math.floor(100000 + Math.random() * 900000);
    setTxnId(id);
    setStatus("Processing");
    setTimeout(() => {
      setStatus("Failed");
    }, 1200);
  };

  const requestRefund = () => {
    alert("Refund Requested ✅ (Mock)");
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Payment Gateway</h2>
        <p className="sub">
          Complete payment to confirm your winning plate
        </p>

        <div className="pay-summary">
          <div>
            <span>Plate Number</span>
            <h3>{plateNumber}</h3>
          </div>
          <div>
            <span>Winning Amount</span>
            <h3>₹{winningAmount.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        {/* Method */}
        <div className="method">
          <h4>Select Payment Method</h4>

          <div className="method-row">
            <button
              className={method === "UPI" ? "active" : ""}
              onClick={() => setMethod("UPI")}
            >
              UPI
            </button>
            <button
              className={method === "CARD" ? "active" : ""}
              onClick={() => setMethod("CARD")}
            >
              Card
            </button>
            <button
              className={method === "NETBANKING" ? "active" : ""}
              onClick={() => setMethod("NETBANKING")}
            >
              Net Banking
            </button>
          </div>

          <div className="method-form">
            {method === "UPI" && (
              <>
                <input placeholder="UPI ID (example@upi)" />
                <p className="hint">Tip: Use any UPI ID (mock payment)</p>
              </>
            )}

            {method === "CARD" && (
              <>
                <input placeholder="Card Number" />
                <div className="row">
                  <input placeholder="MM/YY" />
                  <input placeholder="CVV" />
                </div>
              </>
            )}

            {method === "NETBANKING" && (
              <>
                <select>
                  <option>Select Bank</option>
                  <option>SBI</option>
                  <option>HDFC</option>
                  <option>ICICI</option>
                  <option>Axis</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="breakdown">
          <div className="line">
            <span>Platform Fee</span>
            <strong>₹{breakdown.platformFee}</strong>
          </div>
          <div className="line">
            <span>GST (2%)</span>
            <strong>₹{breakdown.gst}</strong>
          </div>
          <div className="line total">
            <span>Total Payable</span>
            <strong>₹{breakdown.total.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Status */}
        <div className={`pay-status ${status.toLowerCase()}`}>
          <span>Status</span>
          <h4>{status}</h4>
          {txnId && <p>Transaction ID: <b>{txnId}</b></p>}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="pay" onClick={payNow}>
            Pay Now
          </button>
          <button className="fail" onClick={failPayment}>
            Fail (Demo)
          </button>
          <button className="refund" onClick={requestRefund}>
            Refund (Mock)
          </button>
        </div>

        {/* Receipt */}
        {status === "Success" && (
          <div className="receipt">
            ✅ Payment Successful <br />
            Plate Confirmed: <b>{plateNumber}</b>
            <br />
            Amount Paid: <b>₹{breakdown.total.toLocaleString("en-IN")}</b>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
