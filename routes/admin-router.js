const express = require('express')
const bcrypt = require('bcrypt')
const auth = require('../token/token-verify')
const adminModel = require('../model/admin')

const app = express();

app.post('/api/admins/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new adminModel({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    const newAdmin = await admin.save();

    const token = jwt.sign({ userId: newAdmin._id }, process.env.TOKEN_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admins/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.TOKEN_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/admins', auth, async (req, res) => {
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


module.exports = app