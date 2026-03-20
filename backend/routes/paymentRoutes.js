const express = require("express");
const { mockPayment, getMyTransactions, getAllTransactionsAdmin } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/mock", protect, mockPayment);
router.get("/me", protect, getMyTransactions);
router.get("/admin/all", protect, adminOnly, getAllTransactionsAdmin);

module.exports = router;
