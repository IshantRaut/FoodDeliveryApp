import Address from "../models/Address.js";

export const addAdress = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address data is missing"
            });
        }

        const {
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        } = address;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !street ||
            !city ||
            !state ||
            !zipcode ||
            !country ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all address details"
            });
        }

        await Address.create({
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        });

        return res.status(201).json({
            success: true,
            message: "Address added successfully"
        });

    } catch (error) {
        console.error("Add Address Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getAddress = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        const addresses = await Address.find({
            userId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            addresses
        });

    } catch (error) {
        console.error("Get Address Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};