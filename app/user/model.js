const mongoose = require('mongoose');
const  { Schema, model } = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

let userSchema = Schema({

full_name: {
        type: String,
        required: [true, 'Nama harus diisi'],
        minlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
        maxlength: [3, 'Panjang nama harus antara 3 - 255 karakter']
  },

  customer_id: {
    type: Number,
  },

  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    maxlength: [255, 'Panjang email maksimal 255 karakter'],
  },

  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    maxlength: [255, 'Panjang password maksimal 255 karakter'],
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  token: [String]

}, { timestamps: true});

userSchema.path('email').validate(function(value){
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`)

userSchema.path('email').validate(async function(value){

    try {
        // (1) Lakukan pencarian ke _collection_ User berdasarkan email
        const count = await this.model('User').count({email: value});

        // (2) kode ini mengindikasikan bahwa jika user ditemukan akan mengembalikan `false` jika ditemukan mengembalikan
        // jika `false` mka validasi gagal
        // jika `true` maka validasi berhasil
        return !count;
    } catch (err) {
      throw err
    }

}, attr => `${attr.value} sudah terdaftar`);

const HASH_ROUND = 10;
userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next()
})

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

module.exports = model('User, userSchema');
