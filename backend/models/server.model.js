const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  commandFormat: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Server', serverSchema);
