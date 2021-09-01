const expressJwt = require('express-jwt');
const errors = require('./errors');

module.exports = authorize;

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        next(new errors.ForbiddenError(`Role '${req.user.role}' doesn't have permission to access on this url.`));
      }
      
      // authentication and authorization successful
      next();
    }
  ];
}
