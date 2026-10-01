import Product from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";


// =========================
// ADD PRODUCT
// =========================

export const addProduct = async (req, res) => {
    try {

        if (!req.body.productData) {
            return res.status(400).json({
                success: false,
                message: "Product data is missing"
            });
        }


        let productData;

        try {
            productData =
                JSON.parse(
                    req.body.productData
                );
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid product data"
            });
        }


        const images =
            req.files || [];


        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload at least one image"
            });
        }


        const imagesUrl =
            await Promise.all(
                images.map(
                    async (item) => {

                        const result =
                            await cloudinary.uploader.upload(
                                item.path,
                                {
                                    resource_type:
                                        "image"
                                }
                            );

                        return result.secure_url;
                    }
                )
            );


        const offerPrice =
            productData.offerPrice ??
            productData.offerprice;


        await Product.create({
            ...productData,
            offerPrice,
            image: imagesUrl
        });


        return res.status(201).json({
            success: true,
            message: "Product added"
        });

    } catch (error) {

        console.error(
            "Add Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// PRODUCT LIST
// =========================

export const productList = async (
    req,
    res
) => {

    try {

        const products =
            await Product.find({});


        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {

        console.error(
            "Product List Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// PRODUCT BY ID
// =========================

export const productById = async (
    req,
    res
) => {

    try {

        const { id } = req.body;


        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }


        const product =
            await Product.findById(id);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        console.error(
            "Product By ID Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// CHANGE STOCK
// =========================

export const changeStock = async (
    req,
    res
) => {

    try {

        const {
            id,
            inStock
        } = req.body;


        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }


        const product =
            await Product.findByIdAndUpdate(
                id,
                { inStock },
                { new: true }
            );


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Stock Updated"
        });

    } catch (error) {

        console.error(
            "Change Stock Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};