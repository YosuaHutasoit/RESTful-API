const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'Authorization failed' });
    }
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  };
  