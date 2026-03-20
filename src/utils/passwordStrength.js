export const calculatePasswordStrength = (password) => {
  if (!password) {
    return { score: 0, label: "", color: "transparent" };
  }

  let score = 0;
  
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { score, label: "Weak", color: "#ef4444" }; // red
  } else if (score <= 4) {
    return { score, label: "Medium", color: "#f59e0b" }; // amber
  } else {
    return { score, label: "Strong", color: "#10b981" }; // green
  }
};
