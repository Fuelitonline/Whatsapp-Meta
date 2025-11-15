const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipients: {
    type: [String],
    required: true,
    validate: [(val) => val.length > 0, 'At least one recipient is required'],
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'document', 'audio', 'location', 'template'],
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  waMessageId: { type: String },
  status: {
    type: String,
    enum: ['SCHEDULED', 'QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'],
    default: 'QUEUED',
  },
  scheduledTime: { type: Date },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

messageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Message', messageSchema);