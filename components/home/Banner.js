import React from 'react'
import Link from 'next/link';

const Banner = () => {
  return (
    <div className='home-banner'>
        <div className='inner'>
            <div className='content'>
                <span>New Arrivals</span>
                <h1>Let's Explore Unique Clothes </h1>
                <p>Explore the latest trends and must-have items that just hit our shelves. From stylish shoes to cutting-edge electronics and fashionable clothing, we have something for everyone.</p>
                <Link href="/collections" className='text-sm uppercase text-white bg-[#B88E2F] font-bold px-12 py-4 inline-flex'>BUY Now</Link>
            </div>
        </div>
    </div>
  )
}

export default Banner
