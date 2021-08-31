const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const User = require('./user.model');

const sessionSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: User,
    required: true
  },
  userAgent: {
    type: String
  },
  token: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

sessionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Session', sessionSchema);
