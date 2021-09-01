module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  // default to 500 server error
  let message = err.message;
  let status = 500;

  if (err.name === "ValidationError") {
    // mongoose validation error
    status = 400;
  }
  if (err.name === "BadRequestError") {
    // custom validation error
    status = 400;
  }
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    status = 401;
  }
  if (err.name === "ForbiddenError") {
    // custom authentication error
    status = 403;
  }
  if (err.name === "NotFoundError") {
    // custom not found error
    status = 404;
  }
  
  return res.status(status).json({
    success: false,
    message: message || 'Internal Server Error.'
  });
}
