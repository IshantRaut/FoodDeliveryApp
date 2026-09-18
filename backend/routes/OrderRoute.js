import express from 'express'
import authUser from '../middlewares/authUser.js'
import { getAllOrders, getUserOrders, placeOrderCod, placeOrderRazor} from '../controller/order.Controller.js'
import authSeller from '../middlewares/authSeller.js'


const orderRouter = express.Router()

// API: POST /api/order/cod -> create a cash-on-delivery order for the logged-in user
orderRouter.post('/cod',authUser, placeOrderCod)

// API: POST /api/order/razor -> create an online Razorpay payment order for the logged-in user
orderRouter.post('/razor',authUser, placeOrderRazor)

// API: GET /api/order/user -> fetch orders placed by the logged-in user
orderRouter.get('/user',authUser, getUserOrders)

// API: GET /api/order/seller -> fetch all placed orders for the seller dashboard
orderRouter.get('/seller',authSeller, getAllOrders )


export default orderRouter;