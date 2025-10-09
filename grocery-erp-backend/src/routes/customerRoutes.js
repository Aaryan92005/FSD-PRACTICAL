const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

// All routes are public for this project
router
  .route('/')
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

router
  .route('/:id')
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

// Special customer routes (public)
router.get('/search/:query', customerController.searchCustomers);
router.get('/stats', customerController.getCustomerStats);
router.get('/export', customerController.exportCustomers);

module.exports = router;
