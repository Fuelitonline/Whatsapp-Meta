const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  profilePicture: { type: String },
  businessName: { type: String },
  businessLogo: { type: String },
  businessAbout: { type: String },
  businessWebsite: { type: String },
  businessAddress: { type: String },
  businessWorkingHours: { type: String },
  waPhoneNumberId: { type: String, required: true },
  waBusinessAccountId: { type: String, required: true },
  waAccessToken: {
    type: String,
    required: true,
    set: (value) => {
      const cipher = crypto.createCipher('aes-256-cbc', process.env.JWT_SECRET);
      return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    },
    get: (value) => {
      const decipher = crypto.createDecipher('aes-256-cbc', process.env.JWT_SECRET);
      return decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    },
  },
  tokenExpiresAt: { type: Date },
  webhookUrl: { type: String },
  verifyToken: { type: String },
  subscribedEvents: {
    type: [String],
    default: ['messages', 'message_template_status_update', 'statuses']
  },
  connectedNumbers: { type: [String], default: [] },
  verificationStatus: { type: String, default: 'verified' },
  lastLogin: { type: String },
  activeDevices: [{
    id: { type: String, required: true },
    device: { type: String, required: true },
    lastActive: { type: String, required: true },
    location: { type: String, required: true },
    current: { type: Boolean, default: false }
  }],
}, { toJSON: { getters: true } });

module.exports = mongoose.model('User', userSchema);