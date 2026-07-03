import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', authMiddleware, getProducts);

router.post('/add', authMiddleware, upload.single('image'), addProduct);

router.delete('/:id', authMiddleware, deleteProduct);

router.put('/:id', authMiddleware, upload.single('image'), updateProduct);

export default router;