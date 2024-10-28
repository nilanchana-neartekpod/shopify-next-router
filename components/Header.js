import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GoSearch } from "react-icons/go";
import { BsCart3 } from "react-icons/bs";
import { HiMiniBars3 } from "react-icons/hi2";
import { HiOutlineUserCircle } from 'react-icons/hi';
import { useRouter } from 'next/router';
import useGlobalStore from '../store/store';
import ProductCard from './ProductCard';

const Header = () => {
  let [cartId, setCartId] = useState(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const cartTotal = useGlobalStore((state) => state.cartTotal);
  const quantity = useGlobalStore((state) => state.quantity);
  const cartItems = useGlobalStore((state) => state.cartItems);
  const router = useRouter();
  const isLoginPage = router.pathname === '/auth/login'; // Check if it's login page
  const isSignUpPage = router.pathname === '/auth/signup';


  useEffect(() => {
    let _cartId = sessionStorage.getItem("cartId");
    console.log('Cart ID from sessionStorage:', _cartId);
    
    if (_cartId) {
      setCartId(_cartId);
      cartTotal(_cartId);  // Fetch cart data
    } else {
      console.warn('No Cart ID found in sessionStorage.');
    }
  }, [cartId, cartTotal]);

  useEffect(() => {
    console.log('Quantity updated:', quantity);
    console.log('Cart Items:', cartItems);
  }, [quantity, cartItems]);

  const toggleSearchInput = () => {
    setShowSearchInput((prev) => !prev);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SEARCH_PRODUCTS',
          searchQuery,
        }),
      });

      const data = await response.json();
      setSearchResults(data.products);
      console.log('Search Results:', data.products);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const hideShowNav = () => {
    setShowNav(!showNav);
  };

  const toggleCartDropdown = () => {
    setShowCartDropdown((prev) => !prev);
  };

  return (
    <header className={`w-full bg-white shadow-md py-4 fixed top-0 left-0 z-50 ${showNav ? 'active-nav' : ''}`}>
      <div className="px-4 md:px-12 mx-auto flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3">
          <Link className={'flex items-center gap-4 cursor-pointer'} href="/">
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
          {/* Search Form */}
          <button onClick={toggleSearchInput} className="hidden md:flex text-gray-800">
            <GoSearch className="w-5 h-5" />
          </button>

          {showSearchInput && (
            <form onSubmit={handleSearch} className="hidden md:flex news-letterform">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md px-2 py-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setShowSearchInput(false)}
              />
              <button type='submit' className="hidden md:flex text-gray-800">
                <GoSearch className="w-5 h-5" />
              </button>
            </form>
          )}

          {/* Cart Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleCartDropdown}
              className="text-gray-800 shoppingCartIcon relative"
            >
              <BsCart3 className="w-5 h-5" />
              <span>{quantity}</span>
            </button>

             {/* Cart Dropdown */}
             {showCartDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-4">
                {cartItems.length > 0 ? (
                  <div>
                    {cartItems.map((item) => {
                      const imageUrl = item.node.merchandise.product.featuredImage?.url;
                      const productTitle = item.node.merchandise.product.title;

                      return (
                        <div key={item.node.id} className="flex justify-between items-center mb-2">
                          {/* Check if imageUrl exists */}
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={productTitle || "Product image"}
                              className="w-12 h-12 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                              {/* Placeholder if no image */}
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <h4 className="text-sm font-semibold">{productTitle}</h4>
                            <p className="text-gray-600 text-sm">
                              ${item.node.merchandise.product.priceRange.minVariantPrice.amount || 'Price not available'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <Link href={`/cart?cartid=${cartId}`} className="text-blue-500 hover:underline mt-2 block">
                      View Cart
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600">No products in the cart.</p>
                    <Link href="/products" className="text-blue-500 hover:underline mt-2 block">
                      Continue Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
          <Link href="/login" className="text-gray-800">
            <HiOutlineUserCircle className="w-5 h-5" />
          </Link>
 
          <HiMiniBars3 className='flex lg:hidden cursor-pointer' onClick={hideShowNav} />
        </div>
      </div>

      {/* Display Search Results */}
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
