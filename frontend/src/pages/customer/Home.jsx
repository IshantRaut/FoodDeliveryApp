import React from 'react'
import MainBanner from '../../components/customer/MainBanner'
import Categories from '../../components/customer/Categories'
import BestSeller from '../../components/customer/BestSeller'
import BottomBanner from '../../components/customer/BottomBanner'
import NewsLetter from '../../components/customer/NewsLetter'

const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <NewsLetter />
    </div>
  )
}

export default Home