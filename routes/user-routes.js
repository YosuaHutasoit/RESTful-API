const express = require('express');
const User = require('../model/user');
const token = require('../token/token-verify');

const router = express.Router();

router.get('/api/users', token, (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error('Gagal mengambil data pengguna:', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna' });
    });
});

module.exports = router;
