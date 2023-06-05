const express = require('express')
const bcrypt = require('bcrypt')
const auth = require('./token/token-verify')

const app = express();

pp.get('/api/admins', auth, async (req, res) => {
    try {
      const admins = await adminModel.find();
      res.json(admins);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/api/admins', auth, async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const admin = new adminModel({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      });
  
      const newAdmin = await admin.save();
      res.status(201).json(newAdmin);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });