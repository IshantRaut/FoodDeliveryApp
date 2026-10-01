import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
            ?.match(/^Bearer\s+(.+)$/i)?.[1];
        const sellerToken = bearerToken || req.cookies?.sellerToken;

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

        if (!decoded?.id || decoded.role !== "seller") {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        console.error(
            "Seller Auth Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired seller token"
        });
    }
};

export default authSeller;