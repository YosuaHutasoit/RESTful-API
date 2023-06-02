const express = require('express');

app.get('/api/users', (req, res) => {
    User.find()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error('Gagal mengambil data pengguna:', err);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna' });
      });
  });
  