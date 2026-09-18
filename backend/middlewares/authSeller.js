import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = req.cookies;

        if (!sellerToken) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const decoded = jwt.verify(
            sellerToken,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "seller") {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid seller token"
        });
    }
};

export default authSeller;