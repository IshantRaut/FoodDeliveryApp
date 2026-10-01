import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
    const { axios, currency, user, navigate } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                "/api/order/user",
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Fetch Orders Error:", error);

            if (error.response?.status === 401) {
                toast.error("Please login to view your orders");
                navigate("/");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                error.message
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="mt-16 text-center py-20">
                <h2 className="text-xl font-medium">
                    Please login to view your orders
                </h2>

                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded"
                >
                    Go Home
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mt-16 text-center py-20">
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="mt-16 pb-10">
            <h1 className="text-2xl font-medium mb-6">
                My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500">
                        You haven't placed any orders yet.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-lg p-5"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-4">
                                <div>
                                    <p className="font-medium">
                                        Order #{order._id}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="text-sm">
                                    <p>
                                        Payment:{" "}
                                        <span className="font-medium">
                                            {order.paymentType}
                                        </span>
                                    </p>

                                    <p>
                                        Status:{" "}
                                        <span className="font-medium">
                                            {order.status ||
                                                "Order Placed"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items?.map((item, index) => (
                                    <div
                                        key={`${order._id}-${index}`}
                                        className="flex items-center justify-between border-b pb-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            {item.product?.image?.[0] && (
                                                <img
                                                    src={
                                                        item.product.image[0]
                                                    }
                                                    alt={
                                                        item.product.name ||
                                                        "Product"
                                                    }
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}

                                            <div>
                                                <p className="font-medium">
                                                    {item.product?.name ||
                                                        "Product"}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="font-medium">
                                            {currency}
                                            {(
                                                (item.product?.offerPrice ||
                                                    0) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {order.address && (
                                <div className="mt-4 text-sm text-gray-600">
                                    <p className="font-medium text-gray-800 mb-1">
                                        Delivery Address
                                    </p>

                                    <p>
                                        {order.address.street},{" "}
                                        {order.address.city}
                                    </p>

                                    <p>
                                        {order.address.state} -{" "}
                                        {order.address.zipcode}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between items-center border-t mt-4 pt-4">
                                <span className="font-medium">
                                    Total
                                </span>

                                <span className="font-semibold text-lg">
                                    {currency}
                                    {Number(order.amount || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;