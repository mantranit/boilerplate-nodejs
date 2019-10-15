const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('../../_helpers/authorize');
const { USER_ROLE, STATUS_CODE, getDomain } = require('../../_helpers/utils');

// routes
/**
 * @swagger
 * /users/authenticate:
 *   post:
 *     tags:
 *       - Users
 *     description: Login and Returns token
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *       - in: formData
 *         name: password
 *         required: true
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response the response
 */
router.post('/authenticate', (req, res, next) => {
  userService.authenticate(req.body)
    .then(user => user ? res.json({
      status: STATUS_CODE,
      data: user
    }) : res.sendStatus(400))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     description: Returns status true|false
 *     parameters:
 *       - in: formData
 *         name: firstName
 *         required: true
 *       - in: formData
 *         name: lastName
 *         required: true
 *       - in: formData
 *         name: email
 *         required: true
 *       - in: formData
 *         name: password
 *         required: true
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.post('/register', (req, res, next) => {
  userService.create(req.body)
    .then(() => res.json({
      status: STATUS_CODE
    }))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     tags:
 *       - Users
 *     description: Sent a token to email and Returns status true|false
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.post('/forgot-password', (req, res, next) => {
  const domain = getDomain(req);
  userService.forgotPassword({...req.body, domain})
    .then(() => res.json({
      status: STATUS_CODE
    }))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/create-password/{accessToken}:
 *   post:
 *     tags:
 *       - Users
 *     description: Set a password for the user and Returns status true|false
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *       - in: formData
 *         name: password
 *         required: true
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.post('/create-password/:accessToken', (req, res, next) => {
  userService.createPassword(req.params.accessToken, req.body)
    .then(() => res.json({
      status: STATUS_CODE
    }))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.get('/', authorize(), (req, res, next) => {
  userService.getAll()
    .then(users => res.json({
      status: STATUS_CODE,
      data: users
    }))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/search:
 *   post:
 *     tags:
 *       - Users
 *     description: Returns users by filter
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: formData
 *         name: filter
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.post('/search', authorize(), (req, res, next) => {
  let filter = {
    text: '',
    skip: 0,
    limit: 10,
    sort: {
      createdDate: 'desc'
    }
  };
  if (req.body.filter) {
    filter = {
      ...filter,
      ...JSON.parse(req.body.filter)
    }
  }
  userService.search(filter)
    .then(users => res.json({
      status: STATUS_CODE,
      data: users.data,
      total: users.total,
      ...filter
    }))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/current:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns current user
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.get('/current', authorize(), (req, res, next) => {
  userService.getById(req.user.sub)
    .then(user => user ? res.json({
      status: STATUS_CODE,
      data: user
    }) : res.sendStatus(404))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a user
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.get('/:id', authorize(), (req, res, next) => {
  userService.getById(req.params.id)
    .then(user => user ? res.json({
      status: STATUS_CODE,
      data: user
    }) : res.sendStatus(404))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Update a user and response that user
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: formData
 *         name: firstName
 *       - in: formData
 *         name: lastName
 *       - in: formData
 *         name: email
 *       - in: formData
 *         name: password
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.put('/:id', authorize(), (req, res, next) => {
  userService.update(req.params.id, req.body)
    .then(user => user ? res.json({
      status: STATUS_CODE,
      data: user
    }) : res.sendStatus(400))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Delete a user and then response a status true|false
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: It always return status code 200 and the end user must be check status inside the response
 */
router.delete('/:id', authorize(USER_ROLE.ADMIN), (req, res, next) => {
  userService.delete(req.params.id)
    .then(() => res.json({
      status: STATUS_CODE
    }))
    .catch(err => next(err));
});

module.exports = router;
