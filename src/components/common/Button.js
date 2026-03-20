export const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button className={`btn btn-${variant} ${className}`.trim()} {...props}>
    {children}
  </button>
);
