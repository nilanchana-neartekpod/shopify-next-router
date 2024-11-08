import React, { useEffect, useState } from 'react';  
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GoSearch } from "react-icons/go";
import { BsCart3 } from "react-icons/bs";
import { HiMiniBars3 } from "react-icons/hi2";
import { HiOutlineUserCircle } from 'react-icons/hi';
import useGlobalStore from '../store/store';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [cartId, setCartId] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
 const { user, logout } = useAuth(); 

  const cartTotal = useGlobalStore((state) => state.cartTotal);
  const quantity = useGlobalStore((state) => state.quantity);
  const cartItems = useGlobalStore((state) => state.cartItems);
  const router = useRouter();

  useEffect(() => {
    let _cartId = sessionStorage.getItem("cartId");
    if (_cartId) {
      setCartId(_cartId);
      cartTotal(_cartId);
    }
  }, [cartId, cartTotal]);

  const toggleSearchInput = () => setShowSearchInput((prev) => !prev);
  const hideShowNav = () => setShowNav(!showNav);

  const toggleCartDropdown = () => {
    setShowProfileDropdown(false); // Close profile dropdown when cart is opened
    setShowCartDropdown((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setShowCartDropdown(false); // Close cart dropdown when profile is opened
    setShowProfileDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 30);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SEARCH_PRODUCTS', searchQuery }),
      });
      const data = await response.json();
      setSearchResults(data.products);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <header className={`w-full bg-white shadow-md py-4 fixed top-0 left-0 z-50 ${showNav ? 'active-nav' : ''}`}>
      <div className="px-4 md:px-12 mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 cursor-pointer">
          <img src="/House.svg" alt="Furniro" className="w-[40px] h-[24px] md:w-[64px] md:h-[40px]" />
          <span className="text-gray-800 text-base md:text-xl font-semibold">Shop Smarter</span>
        </Link>
        
        <nav className="flex space-x-6 gap-4 lg:gap-10 navigation">
          <Link href="/" className="text-gray-800">Home</Link>
          <Link href="/products" className="text-gray-800">Shop</Link>
          <Link href="/collections/shoes" className="text-gray-800">Shoes</Link>
          <Link href="/collections/electronics" className="text-gray-800">Electronics</Link>
          <Link href="/collections/clothes" className="text-gray-800">Clothes</Link>
        </nav>

        <div className="flex items-center space-x-6 gap-1 md:gap-5">
          <button onClick={toggleSearchInput} className="hidden md:flex text-gray-800">
            <GoSearch className="w-5 h-5" />
          </button>

          {showSearchInput && (
            <form className="hidden md:flex news-letterform">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md px-2 py-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setShowSearchInput(false)}
              />
              <button 
                type="button"
                className="absolute top-0 right-0 mb-2 mr-0 text-gray-600 hover:text-gray-800 text-2xl" 
                onClick={() => setShowSearchInput(false)}
              >
                &times;
              </button>
            </form>
          )}

          <div className="relative">
            <button onClick={toggleCartDropdown} className="text-gray-800 shoppingCartIcon relative">
              <BsCart3 className="w-5 h-5" />
              <span>{quantity}</span>
            </button>

            {showCartDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.node.id} className="flex justify-between items-center mb-2">
                    {item.node.merchandise.product.featuredImage?.url ? (
                      <img
                        src={item.node.merchandise.product.featuredImage.url}
                        alt={item.node.merchandise.product.title || "Product image"}
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold">{item.node.merchandise.product.title}</h4>
                      <p className="text-gray-600 text-sm">
                        ${item.node.merchandise.product.priceRange.minVariantPrice.amount || 'Price not available'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center relative">
                  <button 
                    className="absolute top-0 right-0 mb-2 mr-0 text-gray-600 hover:text-gray-800 text-2xl" 
                    onClick={() => setShowCartDropdown(false)}
                  >
                    &times; {/* Close icon */}
                  </button>
                  <p className="text-gray-600">No products in the cart.</p>
                  <Link href="/products" className="text-blue-500 hover:underline mt-2 block">Continue Shopping</Link>
                </div>
              )}
            </div>
          )}
          </div>

          <div className="relative">
            <button onClick={toggleProfileDropdown} className="text-gray-800">
              <HiOutlineUserCircle className="w-5 h-5" />
            </button>

            {showProfileDropdown && (

              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4">
                {user ? (
                  <>
                    <p className="text-gray-800 font-semibold">Welcome, {user?.Name || "Guest"}</p>
                    <Link href="/customer" className="block text-gray-700 hover:text-blue-500">
                    User Profile
                    </Link>
                    <button onClick={logout} className="mt-2 w-full text-left text-red-500 hover:text-red-600">Logout</button>
                  </>
                ) : (
                  <Link href="/login" className="block text-blue-500 hover:underline mt-2">Login</Link>
                )}
              </div>
            )}

            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4">
              <button 
                className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800 text-2xl" 
                onClick={() => setShowProfileDropdown(false)}
              >
                &times; {/* Close icon */}
              </button>
              {user ? (
                <>
                  <p className="text-gray-800 font-semibold">Welcome, {user?.Name || user.Name}</p>
                  <Link href="/customer" className="block text-gray-700 hover:text-blue-500">
                    User Profile
                    </Link>
                  <button onClick={logout} className="mt-2 w-full text-left text-red-500 hover:text-red-600">Logout</button>
                </>
              ) : (
                <Link href="/login" className="block text-blue-500 hover:underline mt-2">Login</Link>
              )}
            </div>
          </div>
          <HiMiniBars3 className='flex lg:hidden cursor-pointer' onClick={hideShowNav} />
        </div>
      </div>

      {showSearchInput && searchResults.length > 0 && (
        <div className="md:px-12 md:pt-8 searchresults grid grid-cols-1 md:grid-cols-5 gap-4 p-4 mx-auto">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
