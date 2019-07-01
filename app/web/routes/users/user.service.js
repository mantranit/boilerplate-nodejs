const bcrypt = require('bcryptjs');
const { User } = require('models/index');
const { getUserStatus } = require('_helpers/utils');
const { validatePassword } = require('_helpers/validations');

module.exports = {
  getUserByToken,
};

async function getUserByToken(accessToken) {
  if(!accessToken) {
    throw 'Access token is not found.';
  }
  return await User.findOne({accessToken});
}