import Order from '../models/Order.js'
import Product from '../models/product.js'
import razorpay from '../configs/razorpay.js'

// Controller: create a cash-on-delivery order and calculate the total amount
export const placeOrderCod = async (req, res) => {
    try{
        const userId = req.userId || req.body.userId;
        const { items, address } = req.body;

        if (!userId || !address || !Array.isArray(items) || items.length === 0) {
            return res.json({success: false, message : "Invalid data"})
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({success: false, message: "Product not found"});
            }
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD'
        });

        return res.json({success: true, message: "Order Placed successfully"})
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}


// Controller: initialize a Razorpay payment order and store the pending order record
export const placeOrderRazor = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid data"
            });
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.json({
                    success: false,
                    message: "Product not found"
                });
            }

            amount += product.offerPrice * item.quantity;
        }

        // 2% tax
        amount += Math.floor(amount * 0.02);

        // Create Razorpay payment order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        // Create your database order
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "ONLINE",
            isPaid: false
        });

        return res.json({
            success: true,
            message: "Razorpay order created",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// Controller: return all accepted orders for the authenticated customer account
export const getUserOrders = async (req , res) => {
    try{

        const userId = req.userId || req.body.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}


// Controller: return every order for the seller dashboard so they can manage fulfillment
export const getAllOrders = async (req , res) => {
    try{
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}


