
import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()

    const [user, setuser] = useState(null)
    const [isSeller, setisSeller] = useState(false)
    const [showUserLogin, setshowUserLogin] = useState(false)
    const [products, setproducts] = useState([])
    const [cartItems, setcartItems] = useState({})
    const [searchQuery, setsearchQuery] = useState({})


    // =========================
    // Fetch Customer
    // =========================
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth')

            if (data.success && data.user) {

                setuser(data.user)

                setisSeller(data.user.role === 'seller')

                setcartItems(data.user.cartItems || {})

            } else {

                setuser(null)
                setisSeller(false)
                setcartItems({})

            }

        } catch (error) {

            setuser(null)
            setisSeller(false)
            setcartItems({})

        }
    }


    // =========================
    // Fetch Products
    // =========================
    const fetchProducts = async () => {

        try {

            const { data } = await axios.get('/api/product/list')

            if (data.success) {

                setproducts(data.products)

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            toast.error(error.message)

        }

    }


    // =========================
    // Add To Cart
    // =========================
    const addToCart = (itemId) => {

        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {

            cartData[itemId] += 1

        } else {

            cartData[itemId] = 1

        }

        setcartItems(cartData)

        toast.success("Added to Cart")
    }


    // =========================
    // Update Cart
    // =========================
    const updateCartItem = (itemId, quantity) => {

        let cartData = structuredClone(cartItems)

        cartData[itemId] = quantity

        setcartItems(cartData)

        toast.success('Cart updated')
    }


    // =========================
    // Remove From Cart
    // =========================
    const removeFromCart = (itemId) => {

        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {

            cartData[itemId] -= 1

            if (cartData[itemId] === 0) {
                delete cartData[itemId]
            }

        }

        setcartItems(cartData)

        toast.success("Remove from cart")
    }


    // =========================
    // Cart Count
    // =========================
    const getCartCount = () => {

        let totalCount = 0

        for (const item in cartItems) {

            totalCount += cartItems[item]

        }

        return totalCount
    }


    // =========================
    // Cart Amount
    // =========================
    const getCartAmount = () => {

        let totalAmount = 0

        for (const item in cartItems) {

            const product = products.find(
                product => product._id === item
            )

            if (product) {

                totalAmount += product.offerPrice * cartItems[item]

            }

        }

        return totalAmount
    }


    // =========================
    // Initial Data Fetch
    // =========================
    useEffect(() => {

        fetchProducts()

        fetchUser()

        // IMPORTANT:
        // fetchSeller() removed from here.
        // Customer app should not call /api/seller/is-auth.

    }, [])


    // =========================
    // Update Cart In Backend
    // =========================
    useEffect(() => {

        const updateCart = async () => {

            try {

                const { data } = await axios.post(
                    '/api/cart/update',
                    { cartItems }
                )

                if (!data.success) {

                    toast.error(data.message)

                }

            } catch (error) {

                // Ignore cart update errors here
            }

        }

        if (user) {

            updateCart()

        }

    }, [cartItems, user])


    const value = {
        setcartItems,
        fetchProducts,

        axios,

        getCartCount,
        getCartAmount,

        searchQuery,
        setsearchQuery,

        cartItems,
        removeFromCart,
        updateCartItem,
        addToCart,

        currency,
        navigate,

        user,
        setuser,

        setisSeller,
        isSeller,

        products,

        showUserLogin,
        setshowUserLogin
    }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
