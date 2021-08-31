const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const { User, Session } = require("models/index");
const { USER_STATUS, USER_ROLE, sendEmail, getDomain } = require("_helpers/utils");
const { validateEmail, validatePassword } = require("_helpers/validations");

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};

async function login(req, res, next) {
  const { email, password, stay } = req.body;

  try {
    let user = await User.findOne({ email: email.toString().toLowerCase() });
    if (!user) {
      return next(new Error("Can not found an account with your information!"));
    }
    if (user.status !== USER_STATUS.ACTIVE) {
      return next(new Error("This account was " + user.status.toLowerCase() + "."));
    }

    if (!bcrypt.compareSync(password, user.hash)) {
      return next(new Error("Incorrect password. Please try again."));
    }

    const { hash, status, accessToken, role, ...userWithoutHash } =
      user.toObject();

    let jwtOption = { expiresIn: "1d" };
    if (stay) {
      jwtOption = { expiresIn: "7d" };
    }

    const session = new Session({
      userId: user._id,
      userAgent: req.get("User-Agent"),
    });
    await session.save();

    const payload = {
      sub: session._id,
      aud: user._id,
      role,
    };
    session.token = jwt.sign(payload, process.env.JWT_SECRET, jwtOption);
    await session.save();

    res.locals.data = {
      session,
      user: { ...userWithoutHash },
    };

    next();
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  const { body: userParam } = req;
  try {
    // validate
    if (!(userParam.email && validateEmail(userParam.email))) {
      return next(new Error("Please enter an valid email address."));
    }
    if (await User.findOne({ email: userParam.email.toString().toLowerCase() })) {
      return next(new Error("This email already exists. Try signing-in."));
    }
    if (!userParam.firstName) {
      return next(new Error("Please enter your first name."));
    }
    if (!userParam.lastName) {
      return next(new Error("Please enter your last name."));
    }
    if (!userParam.password) {
      return next(new Error("Please enter your password."));
    }
    if (userParam.password && !validatePassword(userParam.password)) {
      return next(new Error("Password does not meet requirements."));
    }

    // set role admin for first account
    const count = await User.count();
    const user = new User({
      ...userParam,
      role: count > 0 ? USER_ROLE.USER : USER_ROLE.ADMIN,
      hash: bcrypt.hashSync(userParam.password, 10),
      status: USER_STATUS.ACTIVE,
    });

    // save user
    await user.save();

    next();
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  const { body: userParam } = req;
  try {
    // validate
    let user = await User.findOne({
      email: userParam.email.toString().toLowerCase(),
    });
    if (!user) {
      return next(new Error("Can not found an account with your information!"));
    }

    // user.status = USER_STATUS.LOCKED;

    // clear old sessions
    await Session.deleteMany({ userId: user.id })

    //token for create new password
    let secret = generator.generate({
      length: 50,
      numbers: true,
    });
    user.accessToken = secret;

    //send mail
    await sendEmail(
      [{ email: user.email }], //to
      config.email.subjectRecoverPassword, //subject
      config.email.templateRecoverPassword, //template
      {
        //dataTemplate
        email: user.email,
        urlReset: `${getDomain(req)}/reset-password/${secret}`,
      }
    );

    // save user
    await user.save();

    next();
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  const { accessToken } = req.params;
  const {body: userParam } = req;
  try {
    if (!accessToken) {
      return next(new Error("Access token is not found."));
    }
    const user = await User.findOne({ accessToken });
    if (!user) {
      return next(new Error("User is not found."));
    }

    if (!userParam.password) {
      return next(new Error("Please enter your password."));
    }
    // hash password if it was entered
    if (userParam.password && !validatePassword(userParam.password)) {
      return next(new Error("Password does not meet requirements."));
    }
    if (userParam.confirmPassword && userParam.confirmPassword !== userParam.password) {
      return next(new Error("Confirm password is not match."));
    }

    user.hash = bcrypt.hashSync(userParam.password, 10);
    user.status = USER_STATUS.ACTIVE;
    user.accessToken = "";

    await user.save();

    next();
  } catch (err) {
    next(err);
  }
}
