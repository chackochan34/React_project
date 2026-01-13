function Payment() {
  return (
    <div className="page">
      <h2>Payment Gateway</h2>
      <button onClick={() => alert("Payment Successful (Mock)")}>
        Pay Now
      </button>
    </div>
  );
}

export default Payment;
