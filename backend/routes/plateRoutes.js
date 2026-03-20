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
    // Basic request validation
    const missing = [];
    if (!number) missing.push('number');
    if (!type) missing.push('type');
    if (currentPrice === undefined || currentPrice === null) missing.push('currentPrice');

    if (missing.length > 0) {
      return res.status(400).json({ error: 'Missing required fields', missing });
    }

    const plate = new Plate({ number, type, currentPrice, status, description });
    await plate.save();
    res.status(201).json({ message: 'Plate created', plate });
  } catch (err) {
    // Mongoose validation errors -> send 400 with details
    if (err && err.name === 'ValidationError') {
      const details = Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {});
      return res.status(400).json({ error: 'Plate validation failed', details });
    }

    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
