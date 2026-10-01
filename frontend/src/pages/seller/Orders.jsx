import React, {
    useEffect,
    useState
} from "react";

import {
    useAppContext
} from "../../context/AppContext";

import { assets } from "../../assets/assets";

import toast from "react-hot-toast";


const Orders = () => {

    const {
        currency,
        axios,
        navigate
    } = useAppContext();


    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const fetchOrders = async () => {

        try {

            setLoading(true);


            const { data } =
                await axios.get(
                    "/api/order/seller",
                    {
                        withCredentials: true
                    }
                );


            if (data.success) {

                setOrders(
                    data.orders || []
                );

            } else {

                toast.error(
                    data.message
                );
            }


        } catch (error) {

            console.error(
                "Fetch Seller Orders Error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "Seller session expired. Please login again."
                );

                navigate("/seller");

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

        fetchOrders();

    }, []);


    if (loading) {

        return (
            <div className="flex-1 h-[95vh] flex items-center justify-center">

                <p>
                    Loading orders...
                </p>

            </div>
        );

    }


    return (

        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">

            <div className="md:p-10 p-4 space-y-4">

                <h2 className="text-lg font-medium">
                    Orders List
                </h2>


                {orders.length === 0 ? (

                    <div className="py-20 text-center">

                        <p className="text-gray-500">
                            No orders found.
                        </p>

                    </div>

                ) : (

                    orders.map(
                        (order) => (

                            <div
                                key={order._id}
                                className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
                            >

                                {/* PRODUCTS */}

                                <div className="flex gap-5 max-w-80">

                                    <img
                                        className="w-12 h-12 object-cover"
                                        src={assets.box_icon}
                                        alt="Order"
                                    />


                                    <div>

                                        {order.items?.map(
                                            (item, index) => (

                                                <div
                                                    key={`${order._id}-${index}`}
                                                    className="flex flex-col"
                                                >

                                                    <p className="font-medium">

                                                        {item.product?.name ||
                                                            "Product"}

                                                        {" "}

                                                        <span className="text-primary">
                                                            x{" "}
                                                            {item.quantity}
                                                        </span>

                                                    </p>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div className="text-sm md:text-base text-black/60">

                                    {order.address ? (
                                        <>
                                            <p className="text-black/80">

                                                {order.address.firstName}{" "}
                                                {order.address.lastName}

                                            </p>


                                            <p>
                                                {order.address.street},{" "}
                                                {order.address.city}
                                            </p>


                                            <p>
                                                {order.address.state},{" "}
                                                {order.address.zipcode},{" "}
                                                {order.address.country}
                                            </p>


                                            <p>
                                                {order.address.phone}
                                            </p>
                                        </>
                                    ) : (

                                        <p>
                                            Address unavailable
                                        </p>

                                    )}

                                </div>


                                {/* AMOUNT */}

                                <p className="font-medium text-lg my-auto">

                                    {currency}
                                    {Number(
                                        order.amount || 0
                                    ).toFixed(2)}

                                </p>


                                {/* ORDER DETAILS */}

                                <div className="flex flex-col text-sm md:text-base text-black/60">

                                    <p>
                                        Method:{" "}
                                        {order.paymentType}
                                    </p>


                                    <p>
                                        Date:{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>


                                    <p>
                                        Payment:{" "}

                                        {order.isPaid
                                            ? "Paid"
                                            : "Pending"}

                                    </p>


                                    <p>
                                        Status:{" "}

                                        {order.status ||
                                            "Order Placed"}

                                    </p>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        </div>
    );
};


export default Orders;