const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('../../_helpers/authorize');
const { USER_ROLE, STATUS_CODE, getDomain } = require('../../_helpers/utils');
const respond = require('../respond');

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
 *         description: Successful
 */
 router.get('/current', authorize(), (req, res, next) => {
  req.params.id = req.user.aud;
  next();
}, userService.getById, respond);

/**
 * @swagger
 * /users/current:
 *   put:
 *     tags:
 *       - Users
 *     description: Update current user and Returns
 *     security:
 *       - Bearer: []
 *     parameters:
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
 *         description: Successful
 */
 router.put('/current', authorize(), (req, res, next) => {
  req.params.id = req.user.aud;
  next();
}, userService.update, respond);

/**
 * @swagger
 * /users/current:
 *   delete:
 *     tags:
 *       - Users
 *     description: Delete current user
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successful
 */
 router.delete('/current', authorize(), (req, res, next) => {
  req.params.id = req.user.aud;
  next();
}, userService.delete, respond);

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
 *         description: Successful
 */
router.get('/', authorize(USER_ROLE.ADMIN), userService.getAll, respond);

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
 *         description: Successful
 */
router.post('/search', authorize(USER_ROLE.ADMIN), userService.search, respond);

/**
 * @swagger
 * /users/:
 *   post:
 *     tags:
 *       - Users
 *     description: Returns status true|false
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *       - in: formData
 *         name: password
 *         required: true
 *     responses:
 *       200:
 *         description: Successful
 */
 router.post("/", authorize(USER_ROLE.ADMIN), userService.create, respond);

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
 *         description: Successful
 */
router.get('/:id', authorize(USER_ROLE.ADMIN), userService.getById, respond);

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
 *         description: Successful
 */
router.put('/:id', authorize(), userService.update, respond);

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
 *         description: Successful
 */
router.delete('/:id', authorize(USER_ROLE.ADMIN), userService.delete, respond);

module.exports = router;
