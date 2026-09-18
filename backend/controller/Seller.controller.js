import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    cartItems: user.cartItems || {}
});

// Seller Login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Find user who is registered as seller
        const seller = await User.findOne({
            email: normalizedEmail,
            role: "seller"
        });

        // Seller doesn't exist
        if (!seller) {
            return res.status(401).json({
                success: false,
                message: "You are not registered as a seller"
            });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(
            password,
            seller.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create seller token
        const token = jwt.sign(
            {
                id: seller._id,
                email: seller.email,
                role: seller.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Save seller token in cookie
        res.cookie("sellerToken", token, cookieOptions);

        return res.json({
            success: true,
            message: "Logged in successfully",
            user: sanitizeUser(seller)
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Check Seller Authentication
export const isSellerAuth = async (req, res) => {
    try {
        const seller = await User.findById(req.userId).select("-password");

        if (!seller || seller.role !== 'seller') {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        return res.json({
            success: true,
            user: sanitizeUser(seller)
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


// Seller Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        // Also clear normal user token
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        return res.json({
            success: true,
            message: "Logged Out"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};