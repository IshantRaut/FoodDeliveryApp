import express from "express";
import authUser from "../middlewares/authUser.js";

import {
    addAdress,
    getAddress
} from "../controller/address.Controller.js";

const addressRouter = express.Router();

// API: POST /api/address/add -> save a new shipping address for the logged-in user
addressRouter.post("/add", authUser, addAdress);

// API: GET /api/address/get -> fetch all saved addresses for the logged-in user
addressRouter.get("/get", authUser, getAddress);

export default addressRouter;

