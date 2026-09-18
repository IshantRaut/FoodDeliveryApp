import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
    
    const {isSeller, setisSeller, setuser, navigate, axios} = useAppContext()
    const [email, setemail] = useState("");
    const [password, setpassword] = useState('');

    const onSubmitHandler = async (event) => {
        try{
            event.preventDefault();
            const {data} =await axios.post('/api/seller/login',{email, password},{ withCredentials: true});
            if(data.success){
                setuser(data.user || null)
                setisSeller(true)
                navigate('/seller')
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.response?.data?.message || error.message)
        }
    }

    

    useEffect(() => {
        if(isSeller){
            navigate('/seller')
        }
    },[isSeller,navigate])

  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
            <p className="text-2xl font-medium m-auto flex gap-2"><span className='text-primary'>Seller </span> Login</p>
            
            <div className="w-full">
                <p>Email</p>
                <input onChange={(e) =>setemail(e.target.value)} value={email} type="email" placeholder='enter your email' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required/>
            </div>
            
            <div className="w-full">
                <p>Password</p>
                <input onChange={(e) =>setpassword(e.target.value)} value={password} type="password" placeholder='enter your password' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required/>
            </div>
        
            <button className='bg-primary-dull text-white w-full py-2 rounded-md cursor-pointer'>Login</button>
        </div>
    </form>
  )
}

export default SellerLogin