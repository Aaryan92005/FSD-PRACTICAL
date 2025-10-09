const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { validateInventoryTransaction } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public GETs for frontend dev; protect writes
router.get('/', inventoryController.getAllTransactions);
router.get('/summary', inventoryController.getInventorySummary);
router.get('/low-stock-alerts', inventoryController.getLowStockAlerts);
router.get('/export', inventoryController.exportInventory);

// Authentication removed: routes are public for this project
router.post('/', validateInventoryTransaction, inventoryController.createTransaction);

router
  .route('/:id')
  .get(inventoryController.getTransaction)
  .patch(inventoryController.updateTransaction)
  .delete(inventoryController.deleteTransaction);

// Special inventory routes
router.get('/product/:productId', inventoryController.getProductTransactions);

// Stock operations
router.post('/receive', inventoryController.receiveStock);
router.post('/issue', inventoryController.issueStock);
router.post('/adjust', inventoryController.adjustStock);

module.exports = router;