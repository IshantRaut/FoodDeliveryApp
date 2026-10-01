import User from "../models/User.js";


// Save current cart items for logged-in user
export const updateCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { cartItems } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        if (!cartItems) {
            return res.status(400).json({
                success: false,
                message: "Cart items are required"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                cartItems
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart updated"
        });

    } catch (error) {
        console.error(
            "Update Cart Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};