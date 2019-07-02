const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.get('/reset-password/:accessToken', (req, res, next) => {
  const token = req.params.accessToken;

  userService.getUserByToken(token)
    .then(user => {
      if (user) {
        res.render('password', { token, error: req.session.error });
      } else {
        res.render('error');
      }
    })
    .catch(err => next(err));
});

router.post('/create-password/:accessToken', (req, res, next) => {
  const token = req.params.accessToken;

  userService.createPassword(token, req.body)
    .then(user => {
      if (user) {
        req.session.success = true;

        res.redirect('/success');
      } else {
        req.session.success = false;
        req.session.error = 'User not found';

        res.redirect(`/reset-password/${token}`);
      }
    })
    .catch(function(err) {
      req.session.success = false;
      req.session.error = err;

      res.redirect(`/reset-password/${token}`);
    });
});

router.get('/success', (req, res, next) => {
  res.render('success');
});

module.exports = router;