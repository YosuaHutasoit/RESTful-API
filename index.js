const express = require('express');
const mongoose = require('mongoose');
const loginUser = require('./routes/user-routes');

const app = express();
const port = 3000;

require('dotenv').config();

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
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', loginUser);

app.get('/', (req, res) => {
  res.send('<h1>Halo, Selamat Datang!</h1>');
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
