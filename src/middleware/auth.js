/**
 * APIForge — JWT Authentication Middleware
 * Author: Shebin S Illikkal | Shebinsillikkal@gmail.com
 */
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

const WHITELIST = ['/health', '/api/auth/login', '/api/auth/register'];

module.exports = function auth(req, res, next) {
  if (WHITELIST.includes(req.path)) return next();

  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.sub;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: message });
  }
};
