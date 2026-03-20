const express = require("express");
const Auction = require("../models/Auction");
const User = require("../models/User");
const { createAuction, updateAuction } = require("../controllers/auctionController");

const router = express.Router();

const typeMap = {
  Regular: "Normal",
  VIP: "VIP",
  Fancy: "Fancy",
  Trending: "Trending",
  Normal: "Normal",
  Cheap: "Cheap",
  Premium: "Premium",
  Celebrity: "Celebrity",
  Lucky: "Lucky",
};

const statusMap = {
  closed: "completed",
  ongoing: "ongoing",
  upcoming: "upcoming",
  completed: "completed",
};

const normalizeCompatPayload = (req, _res, next) => {
  const body = req.body || {};
  const normalizedType = typeMap[body.type] || body.type;
  const normalizedStatus = statusMap[body.status] || body.status;

  if (body.currentPrice !== undefined && body.price === undefined) {
    body.price = Number(body.currentPrice);
  }

  if (normalizedType) body.type = normalizedType;
  if (normalizedStatus) body.status = normalizedStatus;

  if (!body.endTime) {
    body.endTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  }

  req.body = body;
  next();
};

const attachCompatAdminUser = async (req, _res, next) => {
  try {
    if (!req.user) {
      const admin = await User.findOne({ role: "admin" }).select("-password");
      if (admin) req.user = admin;
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Backward compatibility for older frontend code still calling /api/plates
router.get("/", async (req, res, next) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Plate not found" });
    return res.json(auction);
  } catch (error) {
    return next(error);
  }
});

router.post("/", normalizeCompatPayload, attachCompatAdminUser, createAuction);
router.put("/:id", normalizeCompatPayload, attachCompatAdminUser, updateAuction);

module.exports = router;
