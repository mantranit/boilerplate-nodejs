const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email                 : {type: String, required: true, unique: true},
  firstName             : {type: String, required: true},
  lastName              : {type: String, required: true},
  hash                  : {type: String, required: true},
  status                : {type: String, enum: ['ACTIVE', 'DEACTIVATED', 'PENDING', 'LOCKED'], default: 'PENDING'},
  accessToken           : {type: String, default: ''},
  createdDate           : {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', schema);
