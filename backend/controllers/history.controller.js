const History = require('../models/history.model');

exports.getAll = async (req, res) => {
  const items = await History.find({}).sort({ timestamp: -1 });
  res.json(items);
};

exports.deleteAll = async (req, res) => {
  await History.deleteMany({});
  res.json({ message: 'All history deleted' });
};
