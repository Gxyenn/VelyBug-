const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin', 'creator', 'developer'], required: true },
  username: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Key', keySchema);
