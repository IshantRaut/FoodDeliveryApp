import React, {useEffect, useState } from 'react'
import {createContext,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'


axios.defaults.withCredentials=true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const AppContext = createContext();
export const AppContextProvider = ({children}) =>{
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate =useNavigate();
    const [user, setuser]=useState(null)
    const [isSeller, setisSeller]=useState(false)
    const [showUserLogin, setshowUserLogin]=useState(false)
    const [products, setproducts]=useState([]) 
    const [cartItems, setcartItems] = useState({})
    const [searchQuery, setsearchQuery] = useState({})



    const fetchSeller = async () => {
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success && data.user){
                setisSeller(data.user.role === 'seller');
                setuser(data.user);
            }else{
                setisSeller(false)
            }
        }catch (error) {
            setisSeller(false)
        }
    }

const fetchUser = async () => {
    try {
        const { data } = await axios.get('/api/user/is-auth');

        if (data.success && data.user) {
            setuser(data.user);
            setisSeller(data.user.role === 'seller');

            // Load cart from database
            setcartItems(data.user.cartItems || {});
        } else {
            setuser(null);
            setisSeller(false);
            setcartItems({});
        }

    } catch (error) {
        setuser(null);
        setisSeller(false);
        setcartItems({});
    }
};

    const fetchProducts = async () =>{
        try {
            const {data} =await axios.get('/api/product/list')

            if(data.success){
                setproducts(data.products);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const addToCart = (itemId) =>{
        let cardData = structuredClone(cartItems);

        if(cardData[itemId]){
            cardData[itemId] +=1;
        }else{
            cardData[itemId] =1;
        }
        setcartItems(cardData);
        toast.success("Added to Cart")
    }

    const updateCartItem =(itemId, quantity) =>{
        let cartData=structuredClone(cartItems);
        cartData[itemId] =quantity;
        setcartItems(cartData)
        toast.success('Cart updated')
    }

    const removeFromCart = (itemId) =>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] -=1;
        
            if(cartData[itemId] === 0){
                delete cartData[itemId]
            }
        }
        
        setcartItems(cartData)
        toast.success("Remove from cart")
    }

    const getCartCount= () =>{
        let totalCount =0;
        for(const item in cartItems){
            totalCount +=cartItems[item];
        }
        return totalCount;
    }

    const getCartAmount = () =>{
        let totalAmount =0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100 ) / 100;
    }

    useEffect(() =>{
        fetchProducts()
        fetchUser();
        fetchSeller();
    },[])

useEffect(() => {
    const updateCart = async () => {
        try {
            const { data } = await axios.post(
                '/api/cart/update',
                { cartItems }
            );

            if (!data.success) {
                toast.error(data.message);
            }

        } catch (error) {
        }
    };

    if (user) {
        updateCart();
    }

}, [cartItems, user]);

    const value ={setcartItems, fetchProducts, fetchSeller, axios , getCartCount , getCartAmount,searchQuery, setsearchQuery,cartItems,removeFromCart,updateCartItem,addToCart ,currency,navigate, user, setuser, setisSeller,products, isSeller, showUserLogin,setshowUserLogin}
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
};

export const useAppContext =()=>{
    return useContext(AppContext)
}
