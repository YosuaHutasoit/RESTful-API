const express = require('express')
const bcrypt = require('bcrypt')
const auth = require('./token/token-verify')

require('dotenv').config()

const app = express();

app.get('/api/users', auth, async (req, res) => {
    try {
      const users = await userModel.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/api/users', auth, async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });