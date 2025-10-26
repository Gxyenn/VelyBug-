const Key = require('../models/key.model');
const History = require('../models/history.model');
const { canCreateRole, isHigherOrEqualRole, roleHierarchy } = require('../middleware/auth.middleware');

exports.getKeys = async (req, res) => {
  try {
    const requesterRole = req.user.role;
    let keys;
    if (requesterRole === 'developer') keys = await Key.find({});
    else if (requesterRole === 'creator') keys = await Key.find({ role: { $in: ['user','admin','creator'] } });
    else if (requesterRole === 'admin') keys = await Key.find({ role: { $in: ['user','admin'] } }).select('-value');
    else return res.status(403).json({ error: 'Forbidden' });

    res.json(keys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createKey = async (req, res) => {
  try {
    const { value, role, username } = req.body;
    if (!value || !role || !username) return res.status(400).json({ error: 'value, role, username required' });

    if (!canCreateRole(req.user.role, role)) return res.status(403).json({ error: 'Forbidden to create that role' });

    const key = new Key({ value, role, username });
    await key.save();

    await History.create({
      actorUsername: req.user.username,
      action: 'created',
      targetUsername: username,
      targetRole: role,
      details: `Created key id ${key._id}`
    });

    res.status(201).json(key);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ error: 'Duplicate value or username' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteKey = async (req, res) => {
  try {
    const id = req.params.id;
    const requester = req.user;

    const keyToDelete = await Key.findById(id);
    if (!keyToDelete) return res.status(404).json({ error: 'Key not found' });

    if (String(keyToDelete._id) === String(requester._id) || keyToDelete.value === requester.value) {
      return res.status(403).json({ error: 'Cannot delete your own key' });
    }

    const roleRankRequester = roleHierarchy.indexOf(requester.role);
    const roleRankTarget = roleHierarchy.indexOf(keyToDelete.role);
    if (roleRankTarget >= roleRankRequester) {
      return res.status(403).json({ error: 'Cannot delete equal or higher role' });
    }

    await keyToDelete.deleteOne();

    await History.create({
      actorUsername: requester.username,
      action: 'deleted',
      targetUsername: keyToDelete.username,
      targetRole: keyToDelete.role,
      details: `Deleted key id ${id}`
    });

    res.json({ message: 'Key deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.changeMyKey = async (req, res) => {
  try {
    const { newKey } = req.body;
    if (!newKey) return res.status(400).json({ error: 'newKey required' });

    const found = await Key.findOne({ value: req.user.value });
    if (!found) return res.status(404).json({ error: 'Current key not found' });

    const exists = await Key.findOne({ value: newKey });
    if (exists) return res.status(400).json({ error: 'newKey already used' });

    found.value = newKey;
    await found.save();

    res.json({ message: 'Key updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
