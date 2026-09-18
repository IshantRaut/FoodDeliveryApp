import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { dummyOrders } from "../../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const {data} = await axios.get('/api/order/user')
      if(data.success){
        setMyOrders(data.orders)
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if(user){
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl font-medium mb-2">My Orders</p>

      <div className="w-16 h-0.5 bg-primary rounded-full mb-8"></div>

      {myOrders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-300 rounded-lg mb-6 p-4 max-w-4xl"
        >
          {/* Order information */}
          <div className="flex justify-between items-center border-b pb-4 mb-4 max-md:flex-col max-md:items-start gap-2">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>

              <p className="font-medium">{order._id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment</p>

              <p className="font-medium">{order.paymentType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount</p>

              <p className="font-medium">
                {currency}
                {order.amount}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4">
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover border rounded"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-700">
                    {item.product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    Price: {currency}
                    {item.product.offerPrice}
                  </p>

                  <p className="text-sm text-gray-500">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="mt-5 pt-4 border-t flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Status</p>

              <p className="font-medium text-primary">{order.status}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Status</p>

              <p
                className={`font-medium ${
                  order.isPaid ? "text-green-600" : "text-orange-500"
                }`}
              >
                {order.isPaid ? "Paid" : "Not Paid"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
