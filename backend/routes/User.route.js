import express from 'express';
import {register, login, isAuth, logout} from '../controller/User.Controller.js'
import authUser from '../middlewares/authUser.js';


const userRouter = express.Router();

// API: POST /api/user/register -> register a new customer account
userRouter.post('/register', register)

// API: POST /api/user/login -> authenticate a customer and create a session cookie
userRouter.post('/login', login)

// API: GET /api/user/is-auth -> verify current logged-in customer session
userRouter.get('/is-auth', authUser, isAuth)

// API: GET /api/user/logout -> clear the customer auth cookie
userRouter.get('/logout', authUser, logout)

export default userRouter