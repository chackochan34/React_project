import { apiClient } from "./apiClient";

export const auctionService = {
  getAuctions: async (params = {}) => {
    const { data } = await apiClient.get("/auctions", { params });
    return data;
  },
  getFeatured: async () => {
    const { data } = await apiClient.get("/auctions/featured");
    return data;
  },
  getByCategory: async (type) => {
    const { data } = await apiClient.get(`/auctions/category/${type}`);
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/auctions/${id}`);
    return data;
  },
  createAuction: async (payload) => {
    const { data } = await apiClient.post("/auctions", payload);
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await apiClient.patch(`/auctions/${id}/status`, { status });
    return data;
  },
  deleteAuction: async (id) => {
    const { data } = await apiClient.delete(`/auctions/${id}`);
    return data;
  },
  exportCsv: async () => {
    const response = await apiClient.get("/auctions/admin/export/csv", { responseType: "blob" });
    return response.data;
  },
};
