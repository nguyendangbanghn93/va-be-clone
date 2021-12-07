const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth.middleware");
const validate = require("../Middleware/validators.middleware");
const authController = require("../Controllers/auth.controllers");

router.post("/register", validate.auth.register, authController.register);
router.post("/active", validate.auth.active, authController.active);
router.post("/resend_email_active", validate.auth.resendEmailActive, authController.resendEmailActive);
router.post("/login", validate.auth.login, authController.login);
router.post("/refresh_token", validate.auth.refreshToken, authController.refreshToken);
router.put("/update", auth, validate.auth.update, authController.update);
router.put("/update_password", auth, validate.auth.updatePassword, authController.updatePassword);
router.post("/forgot_password", validate.auth.forgotPassword, authController.forgotPassword);
router.put("/reset_password", validate.auth.resetPassword, authController.resetPassword);
router.get("/:id", authController.getInfo);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                 - email
 *                 - password
 *                 - password_confirmation
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               password_confirmation:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               password: password1
 *               password_confirmation: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/refresh_token:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: password1
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @swagger
 * /message/send_msg:
 *   post:
 *     summary: AI Service send message back to conversation
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - from
 *               - to
 *               - message
 *             properties:
 *               conversationId:
 *                 type: string
 *                 format: text
 *                 minLength: 2
 *                 description: ObjectId of conversation

 *               from:
 *                 type: string
 *                 format: text
 *                 minLength: 2
 *                 description: id of page
 *               to:
 *                 type: string
 *                 format: text
 *                 minLength: 2
 *                 description: id of customer
 *               message:
 *                 type: string
 *                 format: text
 *                 minLength: 2
 *                 description: text message content

 *     responses:
 *       "201":
 *         description: created successfully
 *       "500":
 *         description: check code for detail
 *         content:
 *           application/json:
 *             examples:
 *               e1031:
 *                  value:
 *                      success: false
 *                      code: 1031
 *                      data: null
 *                      message: Server không được cấu hình cho AI gửi tin nhắn
 *               e1032:
 *                 value:
 *                  code: 1032
 *                  message: Server nhận được key sai
 *                  success: false
 *                  data: null
 */