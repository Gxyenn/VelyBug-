const Settings = require('../models/settings.model');

exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne({});
  if (!settings) return res.status(404).json({ error: 'Settings not configured' });
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  const { botToken, chatId, mongoURI } = req.body;
  if (!botToken || !chatId) return res.status(400).json({ error: 'botToken and chatId required' });

  let settings = await Settings.findOne({});
  if (!settings) {
    settings = new Settings({ botToken, chatId, mongoURI });
  } else {
    settings.botToken = botToken;
    settings.chatId = chatId;
    if (mongoURI) settings.mongoURI = mongoURI;
  }
  await settings.save();
  res.json(settings);
};
