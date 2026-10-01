import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const {
        products,
        currency,
        cartItems,
        removeFromCart,
        getCartAmount,
        updateCartItem,
        navigate,
        axios,
        user,
        setcartItems
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get(
                "/api/address/get",
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setAddresses(data.addresses);

                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    const placeOrder = async () => {
        try {
            if (!user) {
                toast.error("Please login to place an order");
                return;
            }

            if (!selectedAddress) {
                toast.error("Please select an address");
                return;
            }

            const items = cartArray.map((item) => ({
                product: item._id,
                quantity: cartItems[item._id]
            }));

            if (items.length === 0) {
                toast.error("Your cart is empty");
                return;
            }

            // COD
            if (paymentOption === "COD") {
                const { data } = await axios.post(
                    "/api/order/cod",
                    {
                        items,
                        address: selectedAddress._id
                    },
                    {
                        withCredentials: true
                    }
                );

                if (data.success) {
                    toast.success(data.message);

                    setcartItems({});
                    navigate("/my-orders");
                } else {
                    toast.error(data.message);
                }

                return;
            }

            // Razorpay
            const { data } = await axios.post(
                "/api/order/razor",
                {
                    items,
                    address: selectedAddress._id
                },
                {
                    withCredentials: true
                }
            );

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            if (!window.Razorpay) {
                toast.error(
                    "Razorpay is not loaded. Please refresh the page."
                );
                return;
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Food Delivery",
                description: "Food Delivery Order",
                order_id: data.razorpayOrderId,

                handler: async function (response) {
                    try {
                        const { data: verifyData } =
                            await axios.post(
                                "/api/order/verify",
                                {
                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature,

                                    orderId: data.orderId
                                },
                                {
                                    withCredentials: true
                                }
                            );

                        if (verifyData.success) {
                            toast.success(
                                "Payment successful"
                            );

                            setcartItems({});
                            navigate("/my-orders");
                        } else {
                            toast.error(
                                verifyData.message
                            );
                        }

                    } catch (error) {
                        toast.error(
                            error.response?.data?.message ||
                            error.message
                        );
                    }
                },

                prefill: {
                    name: user.name,
                    email: user.email
                },

                theme: {
                    color: "#3399cc"
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function (response) {
                    toast.error(
                        response.error?.description ||
                        "Payment failed"
                    );
                }
            );

            razorpay.open();

        } catch (error) {
            console.error("Place Order Error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };

    useEffect(() => {
        const tempArray = [];

        for (const item in cartItems) {
            const product = products.find(
                (product) => product._id === item
            );

            if (product) {
                tempArray.push({
                    ...product,
                    quantity: cartItems[item]
                });
            }
        }

        setCartArray(tempArray);
    }, [cartItems, products]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user]);

    return (
        <div className="mt-16">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Cart Items */}
                <div className="flex-1">
                    <h1 className="text-2xl font-medium mb-6">
                        Shopping Cart
                    </h1>

                    {cartArray.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500">
                                Your cart is empty
                            </p>

                            <button
                                onClick={() => navigate("/")}
                                className="mt-4 px-6 py-2 bg-primary text-white rounded"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartArray.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image?.[0]}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />

                                        <div>
                                            <h2 className="font-medium">
                                                {item.name}
                                            </h2>

                                            <p className="text-gray-500">
                                                {currency}
                                                {item.offerPrice}
                                            </p>

                                            <div className="flex items-center gap-3 mt-2">
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item._id
                                                        )
                                                    }
                                                    className="px-2 py-1 border rounded"
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateCartItem(
                                                            item._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="px-2 py-1 border rounded"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="font-medium">
                                        {currency}
                                        {(
                                            item.offerPrice *
                                            item.quantity
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                {cartArray.length > 0 && (
                    <div className="w-full lg:w-96 border rounded-lg p-6">

                        <h2 className="text-xl font-medium mb-5">
                            Order Summary
                        </h2>

                        {/* Address */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">
                                    Delivery Address
                                </h3>

                                <button
                                    onClick={() =>
                                        setShowAddress(!showAddress)
                                    }
                                    className="text-primary text-sm"
                                >
                                    Change
                                </button>
                            </div>

                            {showAddress && (
                                <div className="space-y-2 border p-3 rounded">
                                    {addresses.map((address) => (
                                        <label
                                            key={address._id}
                                            className="flex gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={
                                                    selectedAddress?._id ===
                                                    address._id
                                                }
                                                onChange={() =>
                                                    setSelectedAddress(
                                                        address
                                                    )
                                                }
                                            />

                                            <span className="text-sm">
                                                {address.street},{" "}
                                                {address.city},{" "}
                                                {address.state} -{" "}
                                                {address.zipcode}
                                            </span>
                                        </label>
                                    ))}

                                    <button
                                        onClick={() =>
                                            navigate("/add-address")
                                        }
                                        className="text-primary text-sm mt-2"
                                    >
                                        + Add New Address
                                    </button>
                                </div>
                            )}

                            {!showAddress &&
                                selectedAddress && (
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            {selectedAddress.street},{" "}
                                            {selectedAddress.city}
                                        </p>

                                        <p>
                                            {selectedAddress.state} -{" "}
                                            {selectedAddress.zipcode}
                                        </p>
                                    </div>
                                )}

                            {!selectedAddress && (
                                <button
                                    onClick={() =>
                                        navigate("/add-address")
                                    }
                                    className="text-primary text-sm"
                                >
                                    + Add Address
                                </button>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">
                                Payment Method
                            </h3>

                            <select
                                value={paymentOption}
                                onChange={(e) =>
                                    setPaymentOption(
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="COD">
                                    Cash on Delivery
                                </option>

                                <option value="Online">
                                    Online Payment
                                </option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                    {currency}
                                    {getCartAmount().toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax (2%)</span>
                                <span>
                                    {currency}
                                    {(
                                        getCartAmount() * 0.02
                                    ).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between font-semibold text-lg border-t pt-3">
                                <span>Total</span>
                                <span>
                                    {currency}
                                    {(
                                        getCartAmount() +
                                        Math.floor(
                                            getCartAmount() * 0.02
                                        )
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrder}
                            className="w-full bg-primary text-white py-3 rounded mt-6"
                        >
                            {paymentOption === "COD"
                                ? "Place Order"
                                : "Pay Now"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;