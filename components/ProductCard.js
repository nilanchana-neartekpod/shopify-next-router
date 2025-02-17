import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import useGlobalStore from '../store/store';
import { useState} from "react";


const ProductCard = ({product, customerId, onClickClose}) => {
  const [checkout, setCheckout] = useState(false);
  const cartTotal = useGlobalStore((state) => state.cartTotal);
  const getwishlist = useGlobalStore((state) => state.getwishlist);
  const wishlist = useGlobalStore((state) => state.wishlist);
  const metafieldId = useGlobalStore((state) => state.metafieldId);
  const customer_Id = useGlobalStore((state) => state.customer_Id);
  const setWishlist = useGlobalStore((state) => state.setWishlist);
    const addToWishlist = useGlobalStore((state) => state.addToWishlist);
    // const isInWishlist = Array.isArray(wishlist) && wishlist.includes(product.id);
   
    const handleAddToCart = async (product) => {
      let cartId = sessionStorage.getItem("cartId");
      if (product.selectedOrFirstAvailableVariant?.availableForSale) {
        const varId = product.selectedOrFirstAvailableVariant?.id;
        console.log("merchandise ID",varId);
        
        if (cartId) {

          let bodyData = { cartId, varId, quantity: 1,
            type: 'UPDATE_CART' };
        
          let settings = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyData)
          }
          let response = await fetch('/api/cart', settings);
          let data = await response.json();

          setCheckout(true);
          cartTotal(data.cartId);
          
        } else {

          let bodyData = {  varId, quantity: 1,
                         type: 'ADD_TO_CART' };
                         console.log("sendind data", bodyData);
                         
          let settings = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyData)
          }
          let response = await fetch('/api/cart', settings);
          let data = await response.json();
          console.log("responseIn",data);
          
          sessionStorage.setItem("cartId", data.cartId);
          setCheckout(true);
          cartTotal(data.cartId);
        }
      }
  };
    const handleToggle = () => toggleWishlistItem(product.id, customerId);
    const handleWishlist = async (pid, title, featuredImage ) => {
      console.log('pr0duct ID:', pid);
      const currentWishlist = wishlist || []; // Get the current wishlist from the store

    // Check if the product is already in the wishlist
    const productExists = currentWishlist.find(item => item.id === pid);
  let updatedWishlist = [...currentWishlist]; // Create a copy of the current wishlist

  if (productExists) {
    // If the product exists, filter it out
    updatedWishlist = updatedWishlist.filter(item => item.id !== pid);
    window.alert('Product removed from wishlist!');
  } else {
    // If the product doesn't exist, push it to the array
    updatedWishlist.push({ id: pid, title:title, img:featuredImage });
    window.alert('Product added to wishlist!');
  }


    // Update the global store with the new wishlist
    setWishlist(updatedWishlist); // This updates the wishlist state

    // Prepare the data for backend update
    const wishlistValue = JSON.stringify({
      wishlist: updatedWishlist,
    });
      const payload = {
        customer_Id,
        metafieldId,
        wishlistValue,
      };
    
      console.log('Payload being sent:', payload);
      try {
        // Send the POST request to the API
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
    
        const data = await response.json();
        console.log('API Response:', data);
    
        if (response.ok) {
          console.log('Wishlist updated successfully');
        } else {
          console.error('Error updating wishlist:', data.message);
        }
      } catch (error) {
        console.error('Error during wishlist update:', error.message);
      }
    
      // const productExists = wishlist.some((item) => item.id === productId);
      // const updatedWishlist = productExists
      //   ? wishlist.filter((item) => item.id !== productId)
      //   : [...wishlist, { id: productId }];
  
      //   try {
      //     const response =await fetch('/api/wishlist', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({
      //         customerId,
      //         metafieldId,
      //         wishlist: updatedWishlist,
      //       }),
      //     });
      //     if (!response.ok) {
      //       throw new Error(`API error: ${response.status}`);
      //     }
      //     handleToggle(); // Update local state
      //   } catch (error) {
      //     console.error('Error updating wishlist:', error);
      //   }
      };
      const handleProductClick = () => {
        // Call the parent-provided callback to close search results
        if (onClickClose) onClickClose();
      };
  return (
    <>
        <div className="product relative px-3 py-3 border rounded-lg overflow-hidden shadow-md group">
            <div className="relative flex items-center justify-center ">
                <Link href={`/products/${product.handle}/?id=${product.id.split('gid://shopify/Product/')[1]}`} onClick={handleProductClick}>
                    

                    {product.featuredImage?.url ? (
                        <>
                            <Image src={product.featuredImage?.url} alt={product.title} fill={true} className="object-cover group-hover:opacity-100 transition-opacity duration-200"/>
                        </>
                    ) : (
                        <>
                            <Image src="https://dummyimage.com/1200/09f/fff.png" alt={product.title} fill={true} className="object-cover group-hover:opacity-100 transition-opacity duration-200"/>
                        </>
                    )}
                  </Link>
                    {/* Icons container, positioned at the bottom and visible only on hover */}
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200  py-2">
                    <button onClick={() => handleAddToCart(product)} className="text-white p-2  rounded-full bg-gray-600 hover:bg-gray-800 ">
                        <FiShoppingCart size={18} />
                    </button>
                    <button className={`text-white p-2 rounded-full ${
                                      wishlist.some(item => item.id === product.id.split('gid://shopify/Product/')[1])
                                        ? 'bg-red-600 hover:bg-red-800'
                                        : 'bg-gray-600 hover:bg-gray-800'
                                    }`}
                        onClick={  () => handleWishlist(`${product.id.split('gid://shopify/Product/')[1]}`,
                        product.title, 
                        product.featuredImage?.url)}
                        >
                        <FiHeart size={18} />
                    </button>
                    </div>
                </div>
                
                <div>
                <Link href={`/products/${product.handle}/?id=${product.id.split('gid://shopify/Product/')[1]}`}  onClick={handleProductClick}>
                    <h5>{product.title}</h5>
                </Link>
                <div>$ {product.priceRange.minVariantPrice.amount}</div>
                <div className='flex items-center justify-center'>
                    {Array.from({ length: Number(product.rating?.value) }, (_, i) => 
                        <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                        </svg>
                    )}
                </div>
            </div> 
        </div>
    </>
  )
}

export default ProductCard
