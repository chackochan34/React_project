export const Loader = ({ label = "Loading..." }) => (
  <div className="loader-wrap">
    <span className="loader" />
    <p>{label}</p>
  </div>
);
