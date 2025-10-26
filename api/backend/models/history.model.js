const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  actorUsername: { type: String, required: true },
  action: { type: String, enum: ['created', 'deleted', 'updated'], required: true },
  targetUsername: { type: String, required: true },
  targetRole: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
