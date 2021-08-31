const bcrypt = require('bcryptjs');
const { User, Session } = require('models/index');
const { USER_STATUS } = require('_helpers/utils');
const { validateEmail, validatePassword } = require('_helpers/validations');
const { USER_ROLE } = require('../../_helpers/utils');

module.exports = {
  getAll,
  search,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll(req, res, next) {
  try {
    res.locals.data = await User.find().select('-hash -accessToken');
    next();
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    let filter = {
      text: '',
      skip: 0,
      limit: 10,
      sort: {
        createdDate: 'desc'
      }
    };
    if (req.body.filter) {
      filter = {
        ...filter,
        ...JSON.parse(req.body.filter)
      }
    }

    let fullText = {};
    if (filter.text) {
      fullText['$text'] = { $search: filter.text };
    }

    const list = await User.find(fullText)
      .select('-hash -accessToken')
      .skip(filter.skip)
      .limit(filter.limit)
      .sort(filter.sort);
    const total = await User.count(fullText);
    
    res.locals.data = {
      list,
      total
    }

    next();
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  const { body: userParam } = req;
  try {
    // validate
    if (!(userParam.email && validateEmail(userParam.email))) {
      return next(new Error('Please enter an valid email address.'));
    }
    if (await User.findOne({email: userParam.email.toString().toLowerCase()})) {
      return next(new Error('This email already exists. Try signing-in.'));
    }
    if (!userParam.firstName) {
      return next(new Error('Please enter your first name.'));
    }
    if (!userParam.lastName) {
      return next(new Error('Please enter your last name.'));
    }
    if (!userParam.password) {
      return next(new Error('Please enter your password.'));
    }
    if (userParam.password && !validatePassword(userParam.password)) {
      return next(new Error('Password does not meet requirements.'));
    }

    const user = new User({
      ...userParam,
      role: USER_ROLE.USER,
      hash: bcrypt.hashSync(userParam.password, 10),
      status: USER_STATUS.ACTIVE
    });

    // save user
    await user.save();
    
    next();
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    res.locals.data = await User.findById(req.params.id).select('-hash -accessToken');
    next();
  } catch (err) {
    next();
  }
}

async function update(req, res, next) {
  const { id } = req.params;
  const { body: userParam } = req;
  try {
    const user = await User.findById(id).select('-hash -accessToken');
    // validate
    if (!user) {
      return next(new Error('User not found'));
    }

    //validate
    if(userParam.email) {
      if (!validateEmail(userParam.email)) {
        return next(new Error('Please enter an valid email address.'));
      }

      if (user.email !== userParam.email && await User.findOne({email: userParam.email})) {
        return next(new Error('This email already exists.'));
      }
    }

    // hash password if it was entered
    if (userParam.password) {
      if (!validatePassword(userParam.password)) {
        return next(new Error('Password does not meet requirements.'));
      }

      user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    const { hash, accessToken, createdDate, ...userParamClean } = userParam;
    // copy userParamClean properties to user
    Object.assign(user, userParamClean);

    await user.save();

    res.locals.data = user;

    next();
  } catch (err) {
    next(err);
  }
}

async function _delete(req, res, next) {
  try {
    await User.findByIdAndRemove(req.params.id);
    await Session.deleteMany({ userId: req.params.id })
    next();
  } catch (err) {
    next(err);
  }
}
