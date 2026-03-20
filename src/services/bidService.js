import { apiClient } from "./apiClient";

export const bidService = {
  placeBid: async (payload) => {
    const { data } = await apiClient.post("/bids", payload);
    return data;
  },
  getHistory: async (auctionId) => {
    const { data } = await apiClient.get(`/bids/auction/${auctionId}`);
    return data;
  },
  getMyBids: async (params = {}) => {
    const { data } = await apiClient.get("/bids/me", { params });
    return data;
  },
  getWinningBids: async () => {
    const { data } = await apiClient.get("/bids/me", { params: { won: true } });
    return data;
  },
};
