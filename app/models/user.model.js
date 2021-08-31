const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'], default: 'USER'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DEACTIVATED', 'PENDING', 'LOCKED'],
    default: 'PENDING'
  },
  accessToken: {
    type: String,
    default: ''
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ '$**': 'text' });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
