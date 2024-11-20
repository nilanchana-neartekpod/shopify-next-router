import React, { useEffect, useState, useRef } from 'react';  
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GoSearch } from "react-icons/go";
import { BsCart3 } from "react-icons/bs";
import { HiMiniBars3 } from "react-icons/hi2";
import { HiOutlineUserCircle } from 'react-icons/hi';
import { AiOutlineHeart } from 'react-icons/ai'; 
import useGlobalStore from '../store/store';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [cartId, setCartId] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  
  
  const { user, logout } = useAuth(); 
  const cartTotal = useGlobalStore((state) => state.cartTotal);
  const quantity = useGlobalStore((state) => state.quantity);
  const cartItems = useGlobalStore((state) => state.cartItems);
  const router = useRouter();
  const profileDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const wishlistDropdownRef = useRef(null);
  const [showCartDropdown, setShowCartDropdown] = useState(false); 
  const cartDrawerRef = useRef(null);

  useEffect(() => {
    let _cartId = sessionStorage.getItem("cartId");
    if (_cartId) {
      setCartId(_cartId);
      cartTotal(_cartId);
    }
  }, [cartId, cartTotal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target)) {
        setShowCartDrawer(false); // Close the drawer
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false); // Close the dropdown
      }
      if (wishlistDropdownRef.current && !wishlistDropdownRef.current.contains(event.target)) {
        setShowWishlistDropdown(false); // Close wishlist dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    const toggleSearchInput = () => setShowSearchInput((prev) => !prev);
    const hideShowNav = () => setShowNav(!showNav);

    const toggleCartDrawer = () => {
    setShowWishlistDropdown(false); 
    setShowCartDrawer((prev) => !prev);
  };
  const handleProductClick = (product) => {
    
    const productId = product.id.split('gid://shopify/Product/')[1];
    const productHandle = product.handle;
  
    // Construct the product page URL
    const productUrl = `/products/${productHandle}?id=${productId}`;
  
    // Redirect to the product page
    router.push(productUrl);
  };


  const toggleProfileDropdown = () => {
    setShowCartDropdown(false); // Close cart dropdown when profile is opened
    setShowProfileDropdown((prev) => !prev);
  };

  const toggleWishlistDropdown = () => {
    setShowCartDropdown(false); // Close cart dropdown when wishlist is opened
    setShowWishlistDropdown((prev) => !prev); // Toggle wishlist dropdown visibility
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce delay

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
          {!showSearchInput && (
            <button onClick={toggleSearchInput} className="hidden md:flex text-gray-800">
              <GoSearch className="w-5 h-5" />
            </button>
          )}

          {showSearchInput && (
            <form className="hidden md:flex news-letterform" onSubmit={(e) => e.preventDefault()}>
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
                onClick={() => setShowSearchInput(false)} // Close search input when clicked
              >
                &times; {/* Close icon */}
              </button>
            </form>
          )}
          {/* Search Results Display */}
          {showSearchInput && searchQuery && (
            <div className="absolute top-full mt-2 bg-white">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((product, index) => (
                    <li key={index} className="py-1 border-b last:border-none">
                      {product.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">The product is not available.</p>
              )}
            </div>
          )}
            <div className="relative">
            <button onClick={toggleCartDrawer} className="text-gray-800 shoppingCartIcon relative">
              <BsCart3 className="w-5 h-5" />
              <span>{quantity}</span>
            </button>
          </div>

            {/* Cart Drawer */}
            {showCartDrawer && (
              <div ref={cartDrawerRef} className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out mt-20">
                <button 
                  onClick={() => setShowCartDrawer(false)} 
                  className="absolute top-4 left-72 text-gray-600 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
                <div className="p-4 bg-gray-100">
                  <h2 className="text-xl font-semibold">Your Cart</h2>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.node.id} className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => handleProductClick(item.node.merchandise.product)}>
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
                        <div className="ml-4 bg-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm font-semibold text-gray-800">{item.node.merchandise.product.title}</h4>
                        <p className="text-xs text-gray-500">
                        ${item.node.merchandise.product.priceRange.minVariantPrice.amount || 'Price not available'}
                        </p>
                      </div>
                      </div>
                    ))
                  ) : (
                    <p>No items in your cart</p>
                  )}
                  <div className="flex justify-between pt-4">
                    
                  {/* <p className="text-gray-600">No products in the cart.</p> */}
                  <Link href="/products" className="text-blue-500 hover:underline mt-2 block">Continue Shopping</Link>
                  </div>
                </div>
              </div>
            )}

          {/* Wishlist Dropdown */}
          <div className="relative">
            <button onClick={toggleWishlistDropdown} className="text-gray-800">
              <AiOutlineHeart className="w-5 h-5" />
            </button>

            {showWishlistDropdown && (
              <div ref={wishlistDropdownRef} className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
                {/* Wishlist content goes here */}
                <p className="text-center text-gray-600">Your wishlist is empty.</p>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button onClick={toggleProfileDropdown} className="text-gray-800">
              <HiOutlineUserCircle className="w-5 h-5" />
            </button>

            {showProfileDropdown && (
              <div ref={profileDropdownRef} className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4">
                <button 
                  className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800 text-2xl" 
                  onClick={() => setShowProfileDropdown(false)}
                >
                  &times; {/* Close icon */}
                </button>
                {user ? (
                  <>
                    <p className="text-gray-800 font-semibold">Welcome, {user?.Name || user.Name}</p>
                    <Link href="/customer" className="block text-blue-400 hover:text-blue-800">
                      User Profile
                    </Link>
                    <button onClick={logout} className="mt-2 w-full text-left text-red-500 hover:text-red-600">Logout</button>
                  </>
                ) : (
                  <Link href="/login" className="block text-blue-500 hover:underline mt-2">Login</Link>
                )}
              </div>
            )}
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


