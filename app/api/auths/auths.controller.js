const express = require("express");
const router = express.Router();
const authService = require("./auth.service");
const respond = require("../respond");

// routes
/**
 * @swagger
 * /auths/login:
 *   post:
 *     tags:
 *       - Auths
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
 *         description: Successful
 */
router.post("/login", authService.login, respond);

/**
 * @swagger
 * /auths/register:
 *   post:
 *     tags:
 *       - Auths
 *     description: Returns status true|false
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
router.post("/register", authService.register, authService.login, respond);

/**
 * @swagger
 * /auths/forgot-password:
 *   post:
 *     tags:
 *       - Auths
 *     description: Sent a token to email and Returns status true|false
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *     responses:
 *       200:
 *         description: Successful
 */
 router.post('/forgot-password', authService.forgotPassword, respond);

/**
 * @swagger
 * /auths/create-password/{accessToken}:
 *   post:
 *     tags:
 *       - Auths
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
 *         description: Successful
 */
 router.post('/create-password/:accessToken', authService.resetPassword, respond);

module.exports = router;
