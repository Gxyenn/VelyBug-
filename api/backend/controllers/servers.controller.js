const Server = require('../models/server.model');

exports.list = async (req, res) => {
  const items = await Server.find({});
  res.json(items);
};

exports.create = async (req, res) => {
  const { serverName, commandFormat } = req.body;
  if (!serverName || !commandFormat) return res.status(400).json({ error: 'serverName and commandFormat required' });

  const s = new Server({ serverName, commandFormat });
  await s.save();
  res.status(201).json(s);
};

exports.getOne = async (req, res) => {
  const s = await Server.findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
};

exports.update = async (req, res) => {
  const { serverName, commandFormat } = req.body;
  const s = await Server.findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  if (serverName) s.serverName = serverName;
  if (commandFormat) s.commandFormat = commandFormat;
  await s.save();
  res.json(s);
};

exports.remove = async (req, res) => {
  const s = await Server.findById(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  await s.deleteOne();
  res.json({ message: 'Server deleted' });
};
