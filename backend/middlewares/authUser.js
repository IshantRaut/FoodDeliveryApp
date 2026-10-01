import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
            ?.match(/^Bearer\s+(.+)$/i)?.[1];
        const token = bearerToken || req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const tokenDecoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!tokenDecoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        req.userId = tokenDecoded.id;

        next();

    } catch (error) {
        console.error("Auth Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;