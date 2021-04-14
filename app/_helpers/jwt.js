const expressJwt = require('express-jwt');
const userService = require('../api/users/user.service');

module.exports = jwt;

function jwt() {
  let path = [
    // public routes that don't require authentication
    '/api/users/authenticate',
    '/api/users/register',
    '/api/users/forgot-password',
    /\/api\/users\/token/i,
    /\/api\/users\/create-password/i
  ];

  return expressJwt({ secret: process.env.JWT_SECRET, algorithms: [process.env.JWT_ALGORITHMS], isRevoked }).unless({ path });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
};
