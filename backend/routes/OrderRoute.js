import express from "express";

import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";

import {
    getAllOrders,
    getUserOrders,
    placeOrderCod,
    placeOrderRazor,
    verifyPayment
} from "../controller/order.Controller.js";

const orderRouter = express.Router();

// Customer routes
orderRouter.post(
    "/cod",
    authUser,
    placeOrderCod
);

orderRouter.post(
    "/razor",
    authUser,
    placeOrderRazor
);

orderRouter.post(
    "/verify",
    authUser,
    verifyPayment
);

orderRouter.get(
    "/user",
    authUser,
    getUserOrders
);

// Seller route
orderRouter.get(
    "/seller",
    authSeller,
    getAllOrders
);

export default orderRouter;