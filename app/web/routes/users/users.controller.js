const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.get('/reset-password/:accessToken', (req, res, next) => {
  const token = req.params.accessToken;

  console.log(req);

  userService.getUserByToken(token)
    .then(user => {
      if (user) {
        res.render('reset_password', { token });
      } else {
        res.render('error');
      }
    })
    .catch(err => next(err));
});

module.exports = router;