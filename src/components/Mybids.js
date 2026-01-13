function MyBids() {
  const bids = JSON.parse(localStorage.getItem("mybids")) || [];

  return (
    <div className="page">
      <h2>My Bids</h2>
      {bids.map((b, i) => (
        <p key={i}>{b.number} - ₹{b.bid}</p>
      ))}
    </div>
  );
}

export default MyBids;
