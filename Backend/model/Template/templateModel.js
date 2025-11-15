const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  waTemplateId: { type: String },
  name: { type: String, required: true },
  language: { type: String, required: true },
  category: { type: String, enum: ['MARKETING', 'UTILITY', 'AUTHENTICATION'], required: true },
  templateType: { type: String, enum: ['CUSTOM', 'CATALOG', 'FLOW', 'AUTHENTICATION'], default: 'CUSTOM' },
  components: {
    header: {
      format: { type: String, enum: ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'] },
      text: { type: String },
      url: { type: String },
    },
    body: {
      text: { type: String, required: true },
      expiry: { type: Number }, // For AUTHENTICATION
    },
    footer: {
      text: { type: String },
    },
    buttons: [{
      type: { type: String, enum: ['URL', 'PHONE_NUMBER', 'QUICK_REPLY', 'FLOW', 'CATALOG', 'OTP'] },
      sub_type: { type: String }, // For OTP: COPY_CODE, ONE_TAP
      text: { type: String },
      url: { type: String },
      phone_number: { type: String },
      flow_id: { type: String },
    }],
    flow: {
      id: { type: String },
      buttonText: { type: String },
    },
    catalog: {
      id: { type: String },
    },
  },
  sampleValues: { type: Map, of: String },
  message_send_ttl_seconds: { type: Number, default: -1 },
  status: { type: String, enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PAUSED'], default: 'DRAFT' },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Template', templateSchema);