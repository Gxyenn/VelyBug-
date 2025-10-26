const axios = require('axios');
const Settings = require('../models/settings.model');
const Server = require('../models/server.model');

exports.sendCommand = async (req, res) => {
  try {
    const { target, serverId } = req.body;
    if (!target || !serverId) return res.status(400).json({ error: 'target and serverId required' });

    const settings = await Settings.findOne({});
    if (!settings) return res.status(500).json({ error: 'Settings not configured' });

    const server = await Server.findById(serverId);
    if (!server) return res.status(404).json({ error: 'Server not found' });

    const command = server.commandFormat.replace(/\$\{target\}/g, target);

    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
    const body = { chat_id: settings.chatId, text: command };

    const tgRes = await axios.post(url, body);
    res.json({ success: true, telegram: tgRes.data });
  } catch (err) {
    console.error('sendCommand error', err?.response?.data || err.message);
    const message = err?.response?.data || { error: err.message };
    res.status(500).json({ error: 'Telegram API error or internal error', details: message });
  }
};
