const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.get('/reset-password/:accessToken', (req, res, next) => {
  const token = req.params.accessToken;

  if (token) {
    res.render('reset_password', { token });
  }
});

module.exports = router;