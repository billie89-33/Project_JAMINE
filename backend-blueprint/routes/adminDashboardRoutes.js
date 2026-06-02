const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * 🛣️ Admin Dashboard Routes
 * Base URL: /api/v1/admin/dashboard
 */

// ป้องกันการเข้าถึง (เฉพาะ Admin)
router.use(protect);
router.use(authorize('admin'));

router.get('/summary', dashboardController.getDashboardSummary);
router.get('/revenue-chart', dashboardController.getRevenueChart);
router.get('/category-sales', dashboardController.getCategorySales);
router.get('/recent-orders', dashboardController.getRecentOrders);
router.get('/top-products', dashboardController.getTopProducts);

module.exports = router;
