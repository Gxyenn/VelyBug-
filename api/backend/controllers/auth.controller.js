const Key = require('../models/key.model');
const Server = require('../models/server.model');
const Settings = require('../models/settings.model');
const History = require('../models/history.model');

exports.login = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: 'Key required' });

    const found = await Key.findOne({ value: key });
    if (!found) return res.status(401).json({ error: 'Invalid Access Key' });

    const userRole = found.role;
    let keys;
    if (userRole === 'developer') {
      keys = await Key.find({});
    } else if (userRole === 'creator') {
      keys = await Key.find({ role: { $in: ['user', 'admin', 'creator'] } });
    } else if (userRole === 'admin') {
      keys = await Key.find({ role: { $in: ['user', 'admin'] } }).select('-value');
    } else {
      keys = [];
    }

    const servers = await Server.find({});
    const settings = await Settings.findOne({});
    const history = (userRole === 'user') ? [] : await History.find({}).sort({ timestamp: -1 }).limit(200);

    res.json({
      isAuthenticated: true,
      role: found.role,
      key: found.value,
      username: found.username,
      data: { keys, servers, settings, history }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
