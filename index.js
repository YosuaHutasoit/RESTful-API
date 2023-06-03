const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

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

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
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

app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/users', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;

  try {
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

app.get('/api/admins', verifyToken, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admins', verifyToken, async (req, res) => {
  const { name, email, password } = req.body;

  try {
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
