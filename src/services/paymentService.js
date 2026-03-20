import { apiClient } from "./apiClient";

export const paymentService = {
  mockPay: async (payload) => {
    const { data } = await apiClient.post("/payments/mock", payload);
    return data;
  },
  getTransactions: async () => {
    const { data } = await apiClient.get("/payments/me");
    return data;
  },
};
