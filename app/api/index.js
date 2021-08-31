const express = require('express');
const router = express.Router();

router.use('/auths', require('./auths/auths.controller'));
router.use('/users', require('./users/users.controller'));

module.exports = router;
