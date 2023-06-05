const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const app = express();

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });
  
      const newUser = await user.save();
  
      const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET);
  
      res.status(201).json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


module.export = app