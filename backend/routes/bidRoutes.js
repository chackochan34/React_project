const express = require("express");
const { placeBid, getBidHistory, getUserBids, getUserWinningBids, getAllBidsAdmin } = require("../controllers/bidController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, placeBid);
router.get("/auction/:auctionId", getBidHistory);
router.get("/me/wins", protect, getUserWinningBids);
router.get("/me", protect, getUserBids);
router.get("/admin/all", protect, adminOnly, getAllBidsAdmin);

module.exports = router;
