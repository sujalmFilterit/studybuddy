import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  console.log('=== Auth Middleware Debug ===');
  console.log('Header:', header);
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');
  
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    console.log('Decoded token:', decoded);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  return next();
}


