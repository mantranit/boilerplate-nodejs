const bcrypt = require('bcryptjs');
const { User } = require('models/index');
const { USER_STATUS } = require('_helpers/utils');
const { validatePassword } = require('_helpers/validations');

module.exports = {
  getUserByToken,
  createPassword,
};

async function getUserByToken(accessToken) {
  if(!accessToken) {
    throw 'Access token is not found.';
  }
  return await User.findOne({accessToken});
}

async function createPassword(accessToken, userParam) {
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
  user.status = USER_STATUS.ACTIVE;
  user.accessToken = '';

  return await user.save();
}