import React from 'react'
import Link from 'next/link';

const Banner = () => {
  return (
    <div className='home-banner'>
        <div className='inner'>
            <div className='content'>
                <span>New Arrival</span>
                <h1>Discover Our New Collections</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p>
                <Link href="/collections" className='text-sm uppercase text-white bg-[#B88E2F] font-bold px-12 py-4 inline-flex'>BUY Now</Link>
            </div>
        </div>
    </div>
  )
}

export default Banner
