import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getProducts, addProduct, updateProduct, deleteProduct} from '../controllers/productController.js';


const router = express.Router();

router.get('/', authMiddleware, getProducts); 
router.post('/add', authMiddleware, addProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.put('/:id', authMiddleware, updateProduct);

export default router;