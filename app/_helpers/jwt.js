const expressJwt = require('express-jwt');
const { User, Session } = require('../models');
const { USER_STATUS } = require('./utils');

module.exports = jwt;

function jwt() {
  let path = [
    // public routes that don't require authentication
    '/api/auths/login',
    '/api/auths/register',
    '/api/auths/forgot-password',
    /\/api\/auths\/create-password/i
  ];

  return expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], isRevoked }).unless({ path });
}

async function isRevoked(req, payload, done) {
  const user = await User.findById(payload.aud);
  const session = await Session.findById(payload.sub);

  // revoke token if user no longer exists
  if (!user || (user && user.status !== USER_STATUS.ACTIVE) || !session) {
    return done(null, true);
  }

  done();
};
