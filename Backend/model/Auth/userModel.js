// models/User.js
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const userSchema = new mongoose.Schema(
  {
    facebookUserId: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    businessName: String,
    waBusinessAccountId: String,
    waPhoneNumberId: String,
    waAccessToken: {
      type: String,
      required: true,
      set: (value) =>
        CryptoJS.AES.encrypt(value, process.env.JWT_SECRET).toString(),
      get: (value) => {
        if (!value) return value;
        try {
          const bytes = CryptoJS.AES.decrypt(value, process.env.JWT_SECRET);
          return bytes.toString(CryptoJS.enc.Utf8);
        } catch (err) {
          return value; // fallback
        }
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Index for faster lookup
userSchema.index({ facebookUserId: 1 });

module.exports = mongoose.model('User', userSchema);