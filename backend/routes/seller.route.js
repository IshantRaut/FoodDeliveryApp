import express from 'express';
import { isSellerAuth, logout, sellerLogin } from '../controller/Seller.controller.js';
import authSeller from '../middlewares/authSeller.js'

const sellerRouter = express.Router();

// API: POST /api/seller/login -> authenticate the seller admin account
sellerRouter.post('/login',sellerLogin)

// API: GET /api/seller/is-auth -> verify current seller session
sellerRouter.get('/is-auth',authSeller,isSellerAuth)

// API: GET /api/seller/logout -> clear the seller auth cookie
sellerRouter.get('/logout',logout)

export default sellerRouter;