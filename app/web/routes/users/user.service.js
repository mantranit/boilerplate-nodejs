const bcrypt = require('bcryptjs');
const { User } = require('models/index');
const { getUserStatus } = require('_helpers/utils');
const { validatePassword } = require('_helpers/validations');

module.exports = {
  createPassword,
};

async function createPassword(accessToken, userParam) {
  if(!accessToken) {
    throw 'Access token is not found.';
  }
  const user = await User.findOne({accessToken});
  if(!user) {
    throw 'User is not found.';
  }

  if (!userParam.password) {
    throw 'Please enter your password.';
  }
  // hash password if it was entered
  if (userParam.password && !validatePassword(userParam.password)) {
    throw 'Password does not meet requirements.';
  }
  if(userParam.confirmPassword && userParam.confirmPassword !== userParam.password) {
    throw 'Confirm password is not match.';
  }

  user.hash = bcrypt.hashSync(userParam.password, 10);
  user.status = getUserStatus().ACTIVE;
  user.accessToken = '';

  return await user.save();
}