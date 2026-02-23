const express = require('express');
const router = express.Router();
const Plate = require('../models/Plate');

// Get all plates
router.get('/', async (req, res) => {
  try {
    const plates = await Plate.find().sort({ createdAt: -1 });
    res.json(plates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get plate by ID
router.get('/:id', async (req, res) => {
  try {
    const plate = await Plate.findById(req.params.id);
    if (!plate) return res.status(404).json({ message: 'Plate not found' });
    res.json(plate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create plate (simple)
router.post('/', async (req, res) => {
  try {
    const { number, type, currentPrice, status, description } = req.body;
    const plate = new Plate({ number, type, currentPrice, status, description });
    await plate.save();
    res.status(201).json({ message: 'Plate created', plate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
