const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Membuat koneksi ke database MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Terhubung ke MongoDB');
  })
  .catch((error) => {
    console.log('Koneksi MongoDB gagal:', error);
  });


// Membuat skema User
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

const app = express();

app.use(express.json());

// Endpoint untuk mendapatkan semua user
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk menambahkan user baru
app.post('/api/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: 'user'
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint untuk mendapatkan semua admin
app.get('/api/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk menambahkan admin baru
app.post('/api/admins', async (req, res) => {
  const admin = new User({
    name: req.body.name,
    email: req.body.email,
    role: 'admin'
  });

  try {
    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Halo, Selamat Datang!</h1>');
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
