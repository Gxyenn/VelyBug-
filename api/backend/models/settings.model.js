const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  botToken: { type: String, required: true },
  chatId: { type: String, required: true },
  mongoURI: { type: String },
  adminPassword: { type: String, default: '' } // optional admin password for dashboard
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
