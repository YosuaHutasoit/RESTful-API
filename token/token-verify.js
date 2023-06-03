const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Authorization failed' });
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');

  if (!process.env.TOKEN_SECRET) {
    return res.status(500).json({ error: 'Token secret is not defined' });
  }

  jwt.verify(tokenWithoutBearer, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
