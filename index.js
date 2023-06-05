const express = require('express');
const mongoose = require('mongoose');

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


app.use(express.json());




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

app.get('/', (req, res) => {
  res.send('<h1>Halo, Selamat Datang!</h1>');
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
