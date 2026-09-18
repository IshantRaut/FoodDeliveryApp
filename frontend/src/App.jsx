import React from 'react'
import Navbar from './components/customer/Navbar'
import Home from './pages/customer/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import Footer from './components/customer/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/customer/Login'
import AllProduct from './pages/customer/AllProduct'
import ProductCategory from './pages/customer/ProductCategory'
import Cart from './pages/customer/Cart'
import AddAddress from './pages/customer/AddAddress'
import MyOrders from './pages/customer/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import Loading from './components/Loading'
import Profile from './components/customer/profile'

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller")
  const {showUserLogin, isSeller }= useAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar/> }
      {showUserLogin ? <Login/> : null}
      
      <Toaster/>
      <div className={`${isSellerPath ? ""  : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProduct/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/loader' element={<Loading/>} />
          <Route path='/profile' element={<Profile/>} />

          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/> }>
          <Route  index element={isSeller ? <AddProduct /> : null} />
          <Route  path='product-list' element={<ProductList />} />
          <Route  path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App