const express = require("express");
const {
  getAllAuctions,
  getFeaturedAuctions,
  getAuctionsByCategory,
  getAuctionById,
  createAuction,
  updateAuction,
  updateAuctionStatus,
  deleteAuction,
  exportAuctionsCsv,
} = require("../controllers/auctionController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getAllAuctions);
router.get("/featured", getFeaturedAuctions);
router.get("/category/:type", getAuctionsByCategory);
router.get("/admin/export/csv", protect, adminOnly, exportAuctionsCsv);
router.get("/:id", getAuctionById);

router.post("/", protect, adminOnly, createAuction);
router.put("/:id", protect, adminOnly, updateAuction);
router.patch("/:id/status", protect, adminOnly, updateAuctionStatus);
router.delete("/:id", protect, adminOnly, deleteAuction);

module.exports = router;
