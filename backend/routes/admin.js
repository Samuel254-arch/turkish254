// admin.js - Admin routes
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Public routes (no login needed)
router.post('/login', AdminController.login);
router.get('/check-auth', AdminController.checkAuth);
router.post('/logout', AdminController.logout);

// Protected routes (need login)
router.get('/stats', requireAdmin, AdminController.getStats);
router.get('/orders', requireAdmin, AdminController.getOrders);
router.get('/orders/:orderNumber', requireAdmin, AdminController.getOrder);

module.exports = router;