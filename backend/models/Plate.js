const mongoose = require('mongoose');

const PlateSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['VIP', 'Fancy'], required: true },
  currentPrice: { type: Number, required: true },
  bidsCount: { type: Number, default: 0 },
  timeRemaining: { type: Number, default: 3600 },
  status: { type: String, enum: ['ongoing', 'upcoming', 'completed'], default: 'ongoing' },
  description: { type: String, default: '' },
  image: { type: String, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Plate', PlateSchema);
