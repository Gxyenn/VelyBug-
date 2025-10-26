const Key = require('../models/key.model');

const roleHierarchy = ['user','admin','creator','developer'];

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers['authorization'] || '';
    const match = header.match(/Bearer\s+(.+)/i);
    const token = match ? match[1].trim() : null;

    if (!token) return res.status(401).json({ error: 'Missing Authorization token' });

    const key = await Key.findOne({ value: token });
    if (!key) return res.status(401).json({ error: 'Invalid Access Key' });

    req.user = { role: key.role, username: key.username, value: key.value, _id: key._id };
    next();
  } catch (err) {
    console.error('auth error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  };
}

function canCreateRole(creatorRole, targetRole) {
  if (creatorRole === 'developer') return true;
  if (creatorRole === 'creator') return ['user','admin'].includes(targetRole);
  if (creatorRole === 'admin') return targetRole === 'user';
  return false;
}

function isHigherOrEqualRole(roleA, roleB) {
  const rA = roleHierarchy.indexOf(roleA);
  const rB = roleHierarchy.indexOf(roleB);
  return rA >= rB;
}

module.exports = {
  authMiddleware,
  requireRole,
  canCreateRole,
  isHigherOrEqualRole,
  roleHierarchy
};
