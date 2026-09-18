import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import {
    addProduct,
    changeStock,
    productById,
    productList
} from '../controller/product.Controller.js';

const productRouter = express.Router();

// API: POST /api/product/add -> add a new product (seller only)
productRouter.post(
    '/add',
    authSeller,
    upload.array('images', 4),
    addProduct
);

// API: GET /api/product/list -> fetch all products for the storefront
productRouter.get('/list', productList);

// API: GET /api/product/id -> fetch a single product by ID
productRouter.get('/id', productById);

// API: POST /api/product/stock -> update product stock status (seller only)
productRouter.post('/stock', authSeller, changeStock);

export default productRouter;