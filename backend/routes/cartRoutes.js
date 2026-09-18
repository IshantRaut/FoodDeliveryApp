import express from 'express'
import authUser from '../middlewares/authUser.js'
import {updateCart} from '../controller/cartController.js'


const cartRouter = express.Router();

// API: POST /api/cart/update -> save the current user cart to the database
cartRouter.post('/update', authUser, updateCart)


export default cartRouter