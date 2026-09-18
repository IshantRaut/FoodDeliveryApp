import Address from "../models/Address.js";

// Controller: save a customer delivery address tied to the authenticated user
export const addAdress = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.json({
                success: false,
                message: "Address data is missing"
            });
        }

        // Get logged-in user ID from auth middleware
        const userId = req.userId;

        await Address.create({
            ...address,
            userId
        });

        res.json({
            success: true,
            message: "Address added successfully"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Controller: return all saved delivery addresses for the authenticated customer
export const getAddress = async (req, res) => {
    try {
        // Get logged-in user ID from auth middleware
        const userId = req.userId;

        const addresses = await Address.find({ userId });

        res.json({
            success: true,
            addresses
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
