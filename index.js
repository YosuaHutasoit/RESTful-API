const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user-router')
const adminRoutes = require('./routes/admin-router')

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
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);


app.get('/', (req, res) => {
  res.send('<h1>Halo, Selamat Datang!</h1>');
});

app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
