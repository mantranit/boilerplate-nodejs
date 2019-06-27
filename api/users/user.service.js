const config = require('../../server/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('models');
const generator = require('generate-password');
const { getUserStatus, sendEmail } = require('_helpers/utils');
const { validateEmail, validatePassword } = require('_helpers/validations');

module.exports = {
  authenticate,
  forgotPassword,
  createPassword,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function authenticate({email, password, stay}) {
  let user = await User.findOne({email: email.toString().toLowerCase()});
  if (!user) {
    throw 'Can not found an account with your information!';
  }
  if(user.status !== getUserStatus().ACTIVE) {
    throw 'This account was ' + user.status.toLowerCase() + '.';
  }

  if(!bcrypt.compareSync(password, user.hash)) {
    throw 'Incorrect password. Please try again.';
  }

  const { hash, status, accessToken, role, ...userWithoutHash } = user.toObject();

  let jwtOption = {expiresIn: '1d'};
  if (stay) {
    jwtOption = {expiresIn: '7d'};
  }

  const tokenLogin = jwt.sign({sub: user.id, role}, process.env.JWT_SECRET, jwtOption);
  return {
    ...userWithoutHash,
    token: tokenLogin
  };
}

async function forgotPassword(userParam) {
  // validate
  let user = await User.findOne({email: userParam.email.toString().toLowerCase()});
  if (!user) {
    throw 'Can not found an account with your information!';
  }

  // user.status = getUserStatus().LOCKED;

  //token for create new password
  let secret = generator.generate({
    length: 30,
    numbers: true
  });
  user.accessToken = secret;

  //send mail
  await sendEmail(
    [{email: user.email}],                  //to
    config.email.subjectRecoverPassword,    //subject
    config.email.templateRecoverPassword,   //template
    {                                       //dataTemplate
      email: user.email,
      urlReset: 'http://domain.com/reset-password/' + secret
    }
  );

  // save user
  await user.save();

}

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

async function getAll() {
  return await User.find().select('-hash -accessToken');
}

async function getById(id) {
  return await User.findById(id).select('-hash -accessToken');
}

async function create(userParam) {
  // validate
  if (!(userParam.email && validateEmail(userParam.email))) {
    throw 'Please enter an valid email address.';
  }
  if (await User.findOne({email: userParam.email.toString().toLowerCase()})) {
    throw 'This email already exists. Try signing-in.';
  }
  if (!userParam.firstName) {
    throw 'Please enter your first name.';
  }
  if (!userParam.lastName) {
    throw 'Please enter your last name.';
  }
  if (!userParam.password) {
    throw 'Please enter your password.';
  }
  if (userParam.password && !validatePassword(userParam.password)) {
    throw 'Password does not meet requirements.';
  }

  const user = new User({
    ...userParam,
    hash: bcrypt.hashSync(userParam.password, 10),
    status: getUserStatus().ACTIVE
  });

  // save user
  await user.save();

}

async function update(id, userParam) {
  const user = await User.findById(id);
  // validate
  if (!user) throw 'User not found';

  //validate
  if(userParam.email) {
    if (!validateEmail(userParam.email)) {
      throw 'Please enter an valid email address.';
    }

    if (user.email !== userParam.email && await User.findOne({email: userParam.email})) {
      throw 'This email already exists.';
    }
  }

  // hash password if it was entered
  if (userParam.password) {
    if (!validatePassword(userParam.password)) {
      throw 'Password does not meet requirements.';
    }

    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  const { hash, accessToken, createdDate, ...userParamClean } = userParam;
  // copy userParamClean properties to user
  Object.assign(user, userParamClean);

  return await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
