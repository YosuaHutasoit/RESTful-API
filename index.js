const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user-router')
const adminRoutes = require('./routes/admin-router')

require('dotenv').config();

const app = express();

connectDB();

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
