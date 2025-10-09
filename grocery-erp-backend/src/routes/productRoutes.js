const express = require('express');
const productController = require('../controllers/productController');
const { validateProduct, validateSearch } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.get('/search', validateSearch, productController.searchProducts);
router.get('/sku/:sku', productController.getProductBySKU);
router.get('/barcode/:barcode', productController.getProductByBarcode);
router.get('/', productController.getAllProducts);
router.post('/', validateProduct, productController.createProduct);

// Product CRUD operations (public for this project)
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

// Special product routes (public)
router.get('/category/:category', productController.getProductsByCategory);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/stats', productController.getProductStats);
router.get('/export', productController.exportProducts);

// Stock management (public)
router.patch('/:id/stock', productController.updateProductStock);

// Bulk operations (public)
router.patch('/bulk/update', productController.bulkUpdateProducts);

module.exports = router;