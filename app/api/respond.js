async function respond(req, res, next) {
    res.json({
        success: true,
        status: 200,
        data: res.locals.data,
    });
}

module.exports = respond;