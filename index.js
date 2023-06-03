const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

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
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

// Endpoint untuk registrasi
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Periksa apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    // Simpan user ke database
    const newUser = await user.save();

    // Menghasilkan token
    const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    // Periksa apakah user ditemukan
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Periksa kecocokan password menggunakan bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Menghasilkan token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk mendapatkan semua user
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk menambahkan user baru
app.post('/api/users', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
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

// Endpoint untuk mendapatkan semua admin
app.get('/api/admins', verifyToken, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk menambahkan admin baru
app.post('/api/admins', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
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

app.get('/', (req, res) => {
  res.send('<h1>Halo, Selamat Datang!</h1>');
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
