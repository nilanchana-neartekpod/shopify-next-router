import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import useGlobalStore from '../store/store';

const ProductCard = ({product, customerId}) => {
    const { wishlist } = useGlobalStore();
    const isInWishlist = Array.isArray(wishlist) && wishlist.includes(product.id);
    console.log('Wishlist in ProductCard:', wishlist);
    console.log('Product:', product);
    const handleToggle = () => toggleWishlistItem(product.id, customerId);
    const handleToggleWishlist = async () => {
        const updatedWishlist = isInWishlist
          ? wishlist.filter((id) => id !== product.id)
          : [...wishlist, product.id];
    
        try {
          const response =await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'UPDATE_WISHLIST',
              wishlist: updatedWishlist,
            }),
          });
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          handleToggle(); // Update local state
        } catch (error) {
          console.error('Error updating wishlist:', error);
        }
      };
  return (
    <>
        <div className="product relative border rounded-lg overflow-hidden shadow-md group">
            <div className="relative">
                <Link href={`/products/${product.handle}/?id=${product.id.split('gid://shopify/Product/')[1]}`}>
                    
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
                    <button className="text-white p-2  rounded-full bg-gray-600 hover:bg-gray-800 ">
                        <FiShoppingCart size={18} />
                    </button>
                    <button className={`text-white p-2 rounded-full ${
                            isInWishlist ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-600 hover:bg-gray-800'
                        }`}
                        onClick={handleToggleWishlist}
                        >
                        <FiHeart size={18} />
                    </button>
                    </div>
                </div>
                
                <div>
                <Link href={`/products/${product.handle}/?id=${product.id.split('gid://shopify/Product/')[1]}`}>
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