module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(200).json({
            status: 400,
            message: err
        });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(200).json({
            status: 400,
            message: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(200).json({
            status: 401,
            message: 'Invalid Token'
        });
    }

    // default to 500 server error
    return res.status(200).json({
        status: 500,
        message: err.message
    });
}
