const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public minimal auth API for experiment
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Protected (requires valid token)
router.use(protect);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
