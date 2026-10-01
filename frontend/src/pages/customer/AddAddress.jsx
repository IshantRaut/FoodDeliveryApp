import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddAddress = () => {
    const { axios, navigate, user } = useAppContext();

    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login first");
            return;
        }

        try {
            const { data } = await axios.post(
                "/api/address/add",
                {
                    address: {
                        ...address,
                        zipcode: Number(address.zipcode),
                        phone: Number(address.phone)
                    }
                },
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                toast.success(data.message);
                navigate("/cart");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Add Address Error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    return (
        <div className="mt-16 flex justify-center pb-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl border rounded-lg p-6"
            >
                <h1 className="text-2xl font-medium mb-6">
                    Add Delivery Address
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={address.firstName}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={address.lastName}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={address.email}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2 md:col-span-2"
                    />

                    <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={address.street}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2 md:col-span-2"
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="number"
                        name="zipcode"
                        placeholder="ZIP / PIN Code"
                        value={address.zipcode}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={address.country}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2"
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={address.phone}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2 md:col-span-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-primary text-white py-3 rounded"
                >
                    Save Address
                </button>
            </form>
        </div>
    );
};

export default AddAddress;