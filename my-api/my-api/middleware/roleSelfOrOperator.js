module.exports = (req, res, next) => {
  if (req.user.role === 'operator') return next();
  if (req.user.role === 'driver' && String(req.user.user_id) === String(req.params.id)) return next();
  return res.status(403).json({ error: 'Forbidden: insufficient permissions.' });
};