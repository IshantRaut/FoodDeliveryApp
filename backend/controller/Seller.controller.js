import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    cartItems: user.cartItems || {}
});


// ==============================
// SELLER LOGIN
// ==============================
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const seller = await User.findOne({
            email: normalizedEmail,
            role: "seller"
        });

        if (!seller) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordMatch =
            await bcrypt.compare(
                password,
                seller.password
            );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

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

        res.cookie(
            "sellerToken",
            token,
            cookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: sanitizeUser(seller)
        });

    } catch (error) {
        console.error(
            "Seller Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==============================
// SELLER AUTH CHECK
// ==============================
export const isSellerAuth = async (req, res) => {
    try {
        const seller =
            await User.findById(req.userId)
                .select("-password");

        if (!seller || seller.role !== "seller") {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        return res.status(200).json({
            success: true,
            user: sanitizeUser(seller)
        });

    } catch (error) {
        console.error(
            "Seller Auth Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==============================
// SELLER LOGOUT
// ==============================
export const logout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged Out"
        });

    } catch (error) {
        console.error(
            "Seller Logout Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};