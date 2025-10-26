const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  botToken: { type: String, required: true },
  chatId: { type: String, required: true },
  mongoURI: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
