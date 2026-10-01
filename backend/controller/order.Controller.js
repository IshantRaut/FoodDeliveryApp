import Order from "../models/Order.js";
import Product from "../models/product.js";
import razorpay from "../configs/razorpay.js";
import crypto from "crypto";

export const placeOrderCod = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        if (
            !userId ||
            !address ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data"
            });
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            isPaid: false
        });

        return res.status(201).json({
            success: true,
            message: "Order Placed successfully"
        });

    } catch (error) {
        console.error("COD Order Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const placeOrderRazor = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        if (
            !userId ||
            !address ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data"
            });
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02);

        const razorpayOrder =
            await razorpay.orders.create({
                amount: Math.round(amount * 100),
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            });

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "ONLINE",
            isPaid: false
        });

        return res.status(201).json({
            success: true,
            message: "Razorpay order created",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !orderId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is missing"
            });
        }

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this order"
            });
        }

        order.isPaid = true;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Get User Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Get All Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};