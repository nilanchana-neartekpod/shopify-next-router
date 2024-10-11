import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa' // Imported FaUser icon for contact
import useGlobalStore from '../store/store'

const Header = () => {
  let [cartId, setCartId] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false); // State to toggle search input visibility

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

  return (
    <header className="w-full bg-white shadow-md py-4 fixed top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3">
          <Link className={'flex items-center gap-4'} href="/">
            {/* Set a smaller width and height for the logo */}
            <img src="/House.svg" alt="Furniro" className="w-[64px] h-[40px]" />
            <span className="text-gray-800 text-xl font-semibold">Shop Smarter</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="flex space-x-6 gap-10">
          <Link href="/" className="text-gray-800">Home</Link>
          <Link href="/products" className="text-gray-800">Shop</Link>
          <Link href="/collections/shoes" className="text-gray-800">Shoes</Link>
          <Link href="/collections/electronics" className="text-gray-800">Electronics</Link>
          <Link href="/collections/clothes" className="text-gray-800">Clothes</Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6 gap-5">
          {/* <Link href="/contact" className="text-">
            <FaUser className="w-5 h-5" />
          </Link> */}
          <button onClick={toggleSearchInput} className="text-gray-800">
            <FaSearch className="w-5 h-5" />
          </button>
          {showSearchInput && (
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md px-2 py-1"
              onBlur={() => setShowSearchInput(false)} // Hide on blur
            />
          )}
          {cartId ? (
            <Link href={`/cart?cartid=${cartId}`} className="text-gray-800 shoppingCartIcon">
              <FaShoppingCart className="w-5 h-5" />
              <span>{quantity}</span>
            </Link>
          ) : (
            <Link href="/cart" className="text-gray-800">
              <FaShoppingCart className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
