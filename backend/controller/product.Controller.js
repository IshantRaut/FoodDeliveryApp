import Product from '../models/product.js';
import { v2 as cloudinary } from "cloudinary";

// Controller: upload one or more product images and save a new product to the catalog
export const addProduct = async (req, res) => {
    try {

        let productData = JSON.parse(req.body.productData);

        const images = req.files || [];

        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image"
            });
        }

        const imagesUrl = await Promise.all(
            images.map(async (item) => {

                const result = await cloudinary.uploader.upload(
                    item.path,
                    { resource_type: "image" }
                );

                return result.secure_url;
            })
        );

        await Product.create({
            ...productData,
            offerPrice: productData.offerprice,
            image: imagesUrl
        });

        res.json({
            success: true,
            message: "Product added"
        });

    } catch (error) {
        res.json({success:false, message: error.message})
    }
};


// Controller: return all available products for the frontend storefront
export const productList = async (req, res) => {
     try{
        const products = await Product.find({})
        res.json({success: true, products})
    }catch(error){
        res.json({success:false, message: error.message})
    }
}


// Controller: fetch a single product record by ID for product details pages
export const productById = async (req, res) => {
    try{
        const { id } =req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    }catch(error){
        res.json({success:false, message: error.message})
    }
}


// Controller: toggle or update the in-stock status of an existing product
export const changeStock = async (req, res) => {
    try{
        const { id , inStock } =req.body

        await Product.findByIdAndUpdate(id, {inStock})
        
        res.json({success: true, message: "Stock Updated"})
    
    }catch(error){
        res.json({success:false, message: error.message})
    }
}