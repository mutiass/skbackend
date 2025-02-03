const mongoose = require('mongoose');
const { dbHost, dbPass, dbName, dbUser } = require('../app/config');

// Menggunakan format koneksi MongoDB Atlas
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

const db = mongoose.connection;

module.exports = db;
