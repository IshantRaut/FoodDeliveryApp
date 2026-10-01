import React from "react";

import Navbar from "./components/customer/Navbar";
import Footer from "./components/customer/Footer";

import Home from "./pages/customer/Home";
import AllProduct from "./pages/customer/AllProduct";
import ProductCategory from "./pages/customer/ProductCategory";
import Cart from "./pages/customer/Cart";
import AddAddress from "./pages/customer/AddAddress";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./components/customer/profile";

import Login from "./components/customer/Login";

import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";

import Loading from "./components/Loading";

import {
    Route,
    Routes,
    useLocation,
    Navigate
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext";


const App = () => {

    const location =
        useLocation();


    const isSellerPath =
        location.pathname.startsWith(
            "/seller"
        );


    const {
        showUserLogin,
        isSeller
    } = useAppContext();


    return (

        <div className="text-default min-h-screen text-gray-700 bg-white">


            {/* CUSTOMER NAVBAR */}

            {!isSellerPath && (
                <Navbar />
            )}


            {/* LOGIN MODAL */}

            {showUserLogin && (
                <Login />
            )}


            <Toaster />


            <div
                className={
                    isSellerPath
                        ? ""
                        : "px-6 md:px-16 lg:px-24 xl:px-32"
                }
            >

                <Routes>


                    {/* ========================= */}
                    {/* CUSTOMER ROUTES */}
                    {/* ========================= */}


                    <Route
                        path="/"
                        element={<Home />}
                    />


                    <Route
                        path="/products"
                        element={<AllProduct />}
                    />


                    <Route
                        path="/products/:category"
                        element={
                            <ProductCategory />
                        }
                    />


                    <Route
                        path="/cart"
                        element={<Cart />}
                    />


                    <Route
                        path="/add-address"
                        element={
                            <AddAddress />
                        }
                    />


                    <Route
                        path="/my-orders"
                        element={
                            <MyOrders />
                        }
                    />


                    <Route
                        path="/profile"
                        element={
                            <Profile />
                        }
                    />


                    <Route
                        path="/loader"
                        element={
                            <Loading />
                        }
                    />


                    {/* ========================= */}
                    {/* CONTACT */}
                    {/* ========================= */}

                    <Route
                        path="/contact"
                        element={
                            <div className="mt-20 min-h-[50vh] flex items-center justify-center">
                                <div className="text-center">

                                    <h1 className="text-3xl font-medium">
                                        Contact Us
                                    </h1>

                                    <p className="mt-3 text-gray-500">
                                        Contact page coming soon.
                                    </p>

                                </div>
                            </div>
                        }
                    />


                    {/* ========================= */}
                    {/* SELLER ROUTES */}
                    {/* ========================= */}


                    <Route
                        path="/seller"
                        element={
                            isSeller
                                ? <SellerLayout />
                                : <SellerLogin />
                        }
                    >

                        <Route
                            index
                            element={
                                isSeller
                                    ? <AddProduct />
                                    : null
                            }
                        />


                        <Route
                            path="product-list"
                            element={
                                isSeller
                                    ? <ProductList />
                                    : <SellerLogin />
                            }
                        />


                        <Route
                            path="orders"
                            element={
                                isSeller
                                    ? <Orders />
                                    : <SellerLogin />
                            }
                        />

                    </Route>


                    {/* ========================= */}
                    {/* FALLBACK */}
                    {/* ========================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </div>


            {/* CUSTOMER FOOTER */}

            {!isSellerPath && (
                <Footer />
            )}

        </div>
    );
};


export default App;