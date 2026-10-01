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

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const normalizedRole =
            role === "seller" ? "seller" : "customer";

        const normalizedEmail =
            email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
            role: normalizedRole
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `${
                    normalizedRole === "seller"
                        ? "Seller"
                        : "User"
                } already exists with this email`
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: normalizedRole
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie(
            "token",
            token,
            cookieOptions
        );

        if (user.role === "seller") {
            res.cookie(
                "sellerToken",
                token,
                cookieOptions
            );
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password is required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
            role: "customer"
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie(
            "token",
            token,
            cookieOptions
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const isAuth = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("isAuth Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged Out"
        });

    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};