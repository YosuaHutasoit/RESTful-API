const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization Failed' });
    }
  
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  };

  module.exports = verifyToken