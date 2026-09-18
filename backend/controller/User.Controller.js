import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

// Controller: register a new customer account and create a JWT cookie
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedRole = role === "seller" ? "seller" : "customer";

        // check existing user in the same role only
        const existingUser = await User.findOne({ email: email.toLowerCase().trim(), role: normalizedRole });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `${normalizedRole === "seller" ? "Seller" : "User"} already exists with this email`
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: normalizedRole
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        if (user.role === "seller") {
            res.cookie("sellerToken", token, cookieOptions);
        }

        return res.json({
            success: true,
            message: "Registration successful",
            user: sanitizeUser(user)
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Controller: authenticate an existing customer and create a JWT cookie
export const login = async (req, res) => {
    try{
        const {email , password} =req.body;

        if(!email || !password){
            return res.status(400).json({success: false, message: 'Email and password is required'});
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail, role: "customer" });

        if(!user){
            const sellerAccount = await User.findOne({ email: normalizedEmail, role: "seller" });

            if (sellerAccount) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid  email or Password'
                });
            }

            return res.status(401).json({success: false, message:'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({success: false, message:'Invalid email or password'});
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'7d'})

        res.cookie('token', token, cookieOptions);

        if (user.role === 'seller') {
            res.cookie('sellerToken', token, cookieOptions);
        }

        return res.json({
            success: true,
            user: sanitizeUser(user)
        })
        
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}


// Controller: return the authenticated customer details from the saved JWT session
export const isAuth = async (req, res) =>{
    try{
        
        const userId = req.userId;

        const user = await User.findById(userId).select("-password")
        
        return res.json({success: true, user})
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

// Controller: clear the customer auth cookie and log the user out
export const logout = async (req, res) =>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
        return res.json({success: true, message: "Logged Out"})
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}