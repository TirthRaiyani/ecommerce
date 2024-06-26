// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const authenticate = require('../middleware/authMiddelware')
// const validateProduct = require('../middleware/validationMiddleware')
// const { CP, validateRequest } = require('../middleware/validationMiddleware')


// router.post('/create', 
//     validateRequest(CP),
//      productController.createProduct);
// router.get('/getallproducts', productController.getAllProducts);
// router.put('/updateproducts/:id', productController.updateProduct);
// router.delete('/deleteproducts/:id', productController.deleteProduct);
// router.get('/productbyid/:id', productController.getProductById);


// module.exports = router;


const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/authMiddelware');
const { CP, validateRequest } = require('../middleware/validationMiddleware')


router.get('/getallproducts', authenticate, productController.getAllProducts);
router.get('/productbyid/:id', authenticate, productController.getProductById);
router.post('/create', authenticate, productController.createProduct);
router.put('/updateproducts/:id', authenticate, productController.updateProduct);
router.delete('/deleteproducts/:id', authenticate, productController.deleteProduct);

module.exports = router;



