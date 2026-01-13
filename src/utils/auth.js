// ✅ USER AUTH
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const loginUser = () => {
  localStorage.setItem("token", "mock-user-token");
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ✅ ADMIN AUTH
export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};

export const loginAdmin = () => {
  localStorage.setItem("adminToken", "mock-admin-token");
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};
