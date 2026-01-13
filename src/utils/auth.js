export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const loginUser = () => {
  localStorage.setItem("token", "mock-jwt-token");
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
