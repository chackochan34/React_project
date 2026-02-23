const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Plate = require('../models/Plate');

// Place bid
router.post('/', async (req, res) => {
  try {
    const { plateId, userId, amount } = req.body;
    if (!plateId || !userId || !amount) return res.status(400).json({ message: 'Missing fields' });

    const plate = await Plate.findById(plateId);
    if (!plate) return res.status(404).json({ message: 'Plate not found' });

    const bid = new Bid({ plate: plateId, user: userId, amount });
    await bid.save();

    // Update plate stats
    plate.currentPrice = amount;
    plate.bidsCount = (plate.bidsCount || 0) + 1;
    await plate.save();

    res.status(201).json({ message: 'Bid placed', bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
