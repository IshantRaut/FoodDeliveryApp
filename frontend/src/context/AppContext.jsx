import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;

axios.defaults.baseURL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:4000";


export const AppContext = createContext();


export const useAppContext = () => {
    return useContext(AppContext);
};


export const AppContextProvider = ({ children }) => {

    const currency =
        import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();


    // =========================
    // AUTH STATE
    // =========================

    const [user, setuser] =
        useState(null);

    const [isSeller, setisSeller] =
        useState(false);


    const [showUserLogin, setshowUserLogin] =
        useState(false);


    // =========================
    // PRODUCTS
    // =========================

    const [products, setproducts] =
        useState([]);


    // =========================
    // CART
    // =========================

    const [cartItems, setcartItems] =
        useState({});


    // =========================
    // SEARCH
    // =========================

    const [searchQuery, setsearchQuery] =
        useState("");


    // =========================
    // CUSTOMER AUTH
    // =========================

    const fetchUser = async () => {

        try {

            const { data } =
                await axios.get(
                    "/api/user/is-auth",
                    {
                        withCredentials: true
                    }
                );

            if (
                data.success &&
                data.user
            ) {

                return data.user;

            }

            return null;

        } catch (error) {

            console.log(
                "Customer authentication:",
                error.response?.data?.message ||
                error.message
            );

            return null;
        }
    };


    // =========================
    // SELLER AUTH
    // =========================

    const fetchSeller = async () => {

        try {

            const { data } =
                await axios.get(
                    "/api/seller/is-auth",
                    {
                        withCredentials: true
                    }
                );

            if (
                data.success &&
                data.user &&
                data.user.role === "seller"
            ) {

                return data.user;

            }

            return null;

        } catch (error) {

            console.log(
                "Seller authentication:",
                error.response?.data?.message ||
                error.message
            );

            return null;
        }
    };


    // =========================
    // CHECK AUTH
    // =========================

    const checkAuth = async () => {

        try {

            const [
                customerUser,
                sellerUser
            ] = await Promise.all([
                fetchUser(),
                fetchSeller()
            ]);


            // Seller session gets priority
            // if a seller token exists.

            if (sellerUser) {

                setuser(sellerUser);

                setisSeller(true);

                setcartItems(
                    sellerUser.cartItems || {}
                );

                return;
            }


            // Customer session

            if (customerUser) {

                setuser(customerUser);

                setisSeller(false);

                setcartItems(
                    customerUser.cartItems || {}
                );

                return;
            }


            // No authenticated user

            setuser(null);

            setisSeller(false);

            setcartItems({});

        } catch (error) {

            console.error(
                "Authentication check error:",
                error
            );

            setuser(null);

            setisSeller(false);

            setcartItems({});
        }
    };


    // =========================
    // PRODUCTS
    // =========================

    const fetchProducts = async () => {

        try {

            const { data } =
                await axios.get(
                    "/api/product/list"
                );

            if (data.success) {

                setproducts(
                    data.products
                );

            } else {

                toast.error(
                    data.message
                );
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        }
    };


    // =========================
    // CART
    // =========================

    const addToCart = (itemId) => {

        const cartData =
            structuredClone(cartItems);


        if (cartData[itemId]) {

            cartData[itemId] += 1;

        } else {

            cartData[itemId] = 1;
        }


        setcartItems(cartData);

        toast.success(
            "Added to Cart"
        );
    };


    const updateCartItem = (
        itemId,
        quantity
    ) => {

        const cartData =
            structuredClone(cartItems);


        if (quantity <= 0) {

            delete cartData[itemId];

        } else {

            cartData[itemId] =
                quantity;
        }


        setcartItems(cartData);

        toast.success(
            "Cart updated"
        );
    };


    const removeFromCart = (
        itemId
    ) => {

        const cartData =
            structuredClone(cartItems);


        if (cartData[itemId]) {

            cartData[itemId] -= 1;


            if (
                cartData[itemId] === 0
            ) {

                delete cartData[itemId];
            }
        }


        setcartItems(cartData);

        toast.success(
            "Removed from cart"
        );
    };


    const getCartCount = () => {

        let totalCount = 0;


        for (
            const item in cartItems
        ) {

            totalCount +=
                cartItems[item];
        }


        return totalCount;
    };


    const getCartAmount = () => {

        let totalAmount = 0;


        for (
            const item in cartItems
        ) {

            const product =
                products.find(
                    (product) =>
                        product._id === item
                );


            if (product) {

                totalAmount +=
                    product.offerPrice *
                    cartItems[item];
            }
        }


        return totalAmount;
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchProducts();

        checkAuth();

    }, []);


    // =========================
    // UPDATE CART
    // =========================

    useEffect(() => {

        const updateCart = async () => {

            try {

                const { data } =
                    await axios.post(
                        "/api/cart/update",
                        {
                            cartItems
                        },
                        {
                            withCredentials: true
                        }
                    );


                if (!data.success) {

                    console.log(
                        "Cart update:",
                        data.message
                    );
                }

            } catch (error) {

                console.log(
                    "Cart update error:",
                    error.response?.data?.message ||
                    error.message
                );
            }
        };


        // Don't update cart for seller

        if (
            user &&
            !isSeller
        ) {

            updateCart();
        }

    }, [
        cartItems,
        user,
        isSeller
    ]);


    // =========================
    // CONTEXT VALUE
    // =========================

    const value = {

        axios,

        currency,

        navigate,


        // Auth

        user,

        setuser,

        isSeller,

        setisSeller,

        showUserLogin,

        setshowUserLogin,

        fetchUser,

        fetchSeller,

        checkAuth,


        // Products

        products,

        fetchProducts,


        // Cart

        cartItems,

        setcartItems,

        addToCart,

        updateCartItem,

        removeFromCart,

        getCartCount,

        getCartAmount,


        // Search

        searchQuery,

        setsearchQuery
    };


    return (
        <AppContext.Provider
            value={value}
        >
            {children}
        </AppContext.Provider>
    );
};


export default AppContextProvider;