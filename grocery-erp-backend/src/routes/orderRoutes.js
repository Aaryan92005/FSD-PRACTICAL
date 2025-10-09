const express = require('express');
const orderController = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validationMiddleware');

const router = express.Router();

// Authentication removed: routes are public for this project

// Order CRUD operations
router
  .route('/')
  .get(orderController.getAllOrders)
  .post(validateOrder, orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

// Special order routes
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/sales-summary', orderController.getSalesSummary);
router.get('/top-selling', orderController.getTopSellingProducts);
router.get('/export', orderController.exportOrders);

// Order status management
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/refund', orderController.processRefund);

// Quick sale
router.post('/quick-sale', orderController.createQuickSale);

module.exports = router;
