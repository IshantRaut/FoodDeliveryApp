import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Profile = () => {

    const { user, axios } = useAppContext();

    const [address, setAddress] = useState(null);
    const [orders, setOrders] = useState([]);

    // Get user address
    const fetchAddress = async () => {
        try {
            const { data } = await axios.get('/api/address');

            if (data.success) {
                setAddress(data.address);
            }
        } catch (error) {
        }
    };

    // Get user orders
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user');

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        if (user) {
            fetchAddress();
            fetchOrders();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login first</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">

            {/* Profile Header */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">

                <h1 className="text-2xl font-semibold mb-6">
                    My Profile
                </h1>

                {/* User Information */}
                <div className="grid sm:grid-cols-2 gap-5">

                    <div>
                        <p className="text-gray-500 text-sm">
                            Name
                        </p>

                        <p className="font-medium text-lg">
                            {user.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">
                            Email
                        </p>

                        <p className="font-medium text-lg">
                            {user.email}
                        </p>
                    </div>

                </div>

            </div>


            {/* Address */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">

                <h2 className="text-xl font-semibold mb-4">
                    My Address
                </h2>

                {address ? (
                    <div className="text-gray-600">
                        <p>{address.name}</p>
                        <p>{address.street}</p>
                        <p>
                            {address.city}, {address.state}
                        </p>
                        <p>{address.zipcode}</p>
                        <p>{address.phone}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">
                        No address saved.
                    </p>
                )}

            </div>


            {/* Orders */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">

                <h2 className="text-xl font-semibold mb-5">
                    My Orders
                </h2>

                {orders.length === 0 ? (
                    <p className="text-gray-500">
                        You haven't placed any orders yet.
                    </p>
                ) : (

                    <div className="space-y-4">

                        {orders.map((order) => (

                            <div
                                key={order._id}
                                className="border border-gray-200 rounded-lg p-4"
                            >

                                <div className="flex justify-between items-center mb-3">

                                    <p className="font-medium">
                                        Order #{order._id.slice(-6)}
                                    </p>

                                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                                        {order.status}
                                    </span>

                                </div>

                                <div className="text-sm text-gray-600">

                                    <p>
                                        Total: ₹{order.amount}
                                    </p>

                                    <p>
                                        Payment: {order.paymentType}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Profile;