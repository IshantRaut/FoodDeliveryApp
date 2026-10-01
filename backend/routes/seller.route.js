import express from "express";

import {
    isSellerAuth,
    logout,
    sellerLogin
} from "../controller/Seller.controller.js";

import authSeller from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

// Seller login
sellerRouter.post(
    "/login",
    sellerLogin
);

// Check seller authentication
sellerRouter.get(
    "/is-auth",
    authSeller,
    isSellerAuth
);

// Seller logout
sellerRouter.get(
    "/logout",
    authSeller,
    logout
);

export default sellerRouter;