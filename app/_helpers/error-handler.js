const { STATUS_CODE } = require('_helpers/utils');

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(200).json({
            status: {
                ...STATUS_CODE,
                success: false,
                message: err,
                errorCode: 400
            }
        });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(200).json({
            status: {
                ...STATUS_CODE,
                success: false,
                message: err.message,
                errorCode: 400,
            }
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(200).json({
            status: {
                ...STATUS_CODE,
                success: false,
                message: 'Invalid Token',
                errorCode: 401,
            }
        });
    }

    // default to 500 server error
    return res.status(200).json({
        status: {
            ...STATUS_CODE,
            success: false,
            message: err.message,
            errorCode: 500,
        }
    });
}
