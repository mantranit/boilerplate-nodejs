const express = require('express');
const router = express.Router();

router.use('/', require('./users/users.controller'));

module.exports = router;