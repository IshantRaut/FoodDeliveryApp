import express from "express";

import authUser from "../middlewares/authUser.js";

import {
    addAdress,
    getAddress
} from "../controller/address.Controller.js";

const addressRouter = express.Router();

addressRouter.post(
    "/add",
    authUser,
    addAdress
);

addressRouter.get(
    "/get",
    authUser,
    getAddress
);

export default addressRouter;