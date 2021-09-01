class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized Action') {
        super(message);
        this.name = 'UnauthorizedError';
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends Error {
    constructor(message = 'Unknown Action') {
        super(message);
        this.name = 'BadRequestError';
        Error.captureStackTrace(this, this.constructor);
    }
}
  
class ForbiddenError extends Error {
    constructor(message = 'Forbidden Action') {
        super(message);
        this.name = 'ForbiddenError';
        Error.captureStackTrace(this, this.constructor);
    }
}
  
class NotFoundError extends Error {
    constructor(message = 'Nothing was found.') {
        super(message);
        this.name = 'NotFoundError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    UnauthorizedError,
    BadRequestError,
    ForbiddenError,
    NotFoundError
}