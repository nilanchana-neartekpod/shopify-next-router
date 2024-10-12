import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa' // Imported FaUser icon for contact
import { GoSearch } from "react-icons/go";
import { BsCart3 } from "react-icons/bs";
import { HiMiniBars3 } from "react-icons/hi2";
import useGlobalStore from '../store/store'

const Header = () => {
  let [cartId, setCartId] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false); // State to toggle search input visibility
  const [showNav, setshowNav] = useState(false);

  const cartTotal = useGlobalStore((state) => state.cartTotal);
  const quantity = useGlobalStore((state) => state.quantity);
  
  useEffect(() => {
    let _cartId = sessionStorage.getItem("cartId");
    if (_cartId){
      setCartId(_cartId);
      cartTotal(cartId);
    }
  }, [cartId, quantity]);

  const toggleSearchInput = () => {
    setShowSearchInput((prev) => !prev);
  };

  const hideShowNav = () =>{
    setshowNav(!showNav);
  }

  return (
    <header className={`w-full bg-white shadow-md py-4 fixed top-0 left-0 z-50 ${showNav ? 'active-nav' : ''}`}>
      <div className="px-4 md:px-12 mx-auto flex items-center justify-between">
        
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3">
          <Link className={'flex items-center gap-4 cursor-pointer'} href="/">
            {/* Set a smaller width and height for the logo */}
            <img src="/House.svg" alt="Furniro" className="w-[40px] h-[24px] md:w-[64px] md:h-[40px]" />
            <span className="text-gray-800 text-base md:text-xl font-semibold">Shop Smarter</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="flex space-x-6 gap-4 lg:gap-10 navigation">
          <Link href="/" className="text-gray-800">Home</Link>
          <Link href="/products" className="text-gray-800">Shop</Link>
          <Link href="/collections/shoes" className="text-gray-800">Shoes</Link>
          <Link href="/collections/electronics" className="text-gray-800">Electronics</Link>
          <Link href="/collections/clothes" className="text-gray-800">Clothes</Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6 gap-1 md:gap-5">
          {/* <Link href="/contact" className="text-">
            <FaUser className="w-5 h-5" />
          </Link> */}
          
          <button onClick={toggleSearchInput} className="hidden md:flex text-gray-800">
            <GoSearch className="w-5 h-5" />
          </button>
          {showSearchInput && (
            <input
              type="text"
              placeholder="Search..."
              className="hidden md:flex border rounded-md px-2 py-1"
              onBlur={() => setShowSearchInput(false)} // Hide on blur
            />
          )}
          {cartId ? (
            <Link href={`/cart?cartid=${cartId}`} className="text-gray-800 shoppingCartIcon">
              <BsCart3 className="w-5 h-5" />
              <span>{quantity}</span>
            </Link>
          ) : (
            <Link href="/cart" className="text-gray-800">
              <BsCart3 className="w-5 h-5" />
            </Link>
          )}
          <HiMiniBars3 className='flex lg:hidden cursor-pointer' onClick={hideShowNav} />
        </div>
      </div>
    </header>
  )
}

export default Header
