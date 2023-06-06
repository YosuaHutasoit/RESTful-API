const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Terhubung ke MongoDB');
  } catch (error) {
    console.log('Koneksi MongoDB gagal:', error);
  }
};

module.exports = connectDB;
