
import User from '../models/User.js';

// Controller: persist the current cart items for the logged-in user in the database
export const updateCart = async (req, res) => {
    try {

        const userId = req.userId;
        const { cartItems } = req.body;

        await User.findByIdAndUpdate(userId, {
            cartItems
        });

        res.json({
            success: true,
            message: "Cart updated"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};