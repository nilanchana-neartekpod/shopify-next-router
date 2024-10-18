import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { addToCart, updateCart } from "../utils/shopify";
import ProductCard from "@/components/ProductCard";
import ImageGallery from "react-image-gallery";
import useGlobalStore from '../store/store'

const ProductDetails = ({product}) => {
    const [quantity, setQuantity] = useState(0);
    const [checkout, setCheckout] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0].node.id);
    const [availableForSale, setAvailableForSale] = useState(product.variants.edges[0].node.availableForSale);

    const cartTotal = useGlobalStore((state) => state.cartTotal);

    let imagesArray =  [];
    for(let item of product.images.nodes){
        imagesArray.push({
            original: item.url,
            thumbnail: item.url,
            srcSet: item.url,
            originalAlt: product.title,
            thumbnailAlt: product.title,
            loading:"lazy",
            thumbnailLoading: "lazy"
        });
    }

    const updateQuantity = (e) => {
        if (e && e.target) {
            setQuantity(Number(e.target.value)); // Convert to number
            if (Number(e.target.value) === 0) setCheckout(false); // Update checkout status based on quantity
        }
    };

    const changeVariantValue = (e) =>{
        setSelectedVariant(e);
        for(let it of product.variants.edges){
            if(it.node.id === e){
                setAvailableForSale(it.node.availableForSale);
            }
        }
    }

    const handleAddToCart = async () => {
        let cartId = sessionStorage.getItem("cartId");
        if (quantity > 0) {
          if (cartId) {

            let settings = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId, varId: selectedVariant, quantity, type: 'UPDATE_CART' })
            }
            let response = await fetch('/api/cart', settings);
            let data = await response.json();

            setCheckout(true);
            cartTotal(data.cartId);
            setQuantity(0);
          } else {

            let settings = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ varId: selectedVariant, quantity, type: 'ADD_TO_CART' })
            }
            let response = await fetch('/api/cart', settings);
            let data = await response.json();

            sessionStorage.setItem("cartId", data.cartId);
            setCheckout(true);
            setQuantity(0);
            cartTotal(data.cartId);
          }
        }
    };

    return (
        <div className="mt-24">
            <div className="product-details px-4 md:px-12 py-8 md:py-12">
                <div className="left">
                    <Suspense fallback={"Loading data...."}>
                        <ImageGallery lazyLoad={true} items={imagesArray} thumbnailPosition={"left"} showFullscreenButton={false} showPlayButton={false} showNav={false} showBullets={true} />
                    </Suspense>
                </div>
                <div className="right md:w-1/2">
                    <nav className="mb-4 text-sm text-gray-600">
                        <Link href="/">Home</Link> &gt; <Link href="/products">Products</Link> &gt; <span>{product.title}</span>
                    </nav>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                        <h3 className="text-xl text-gray-700 mb-4">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</h3> 

                        <div className="mb-4 flex">
                            {Array.from({ length: Number(product.rating.value) }, (_, i) => 
                                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                                </svg>
                            )}
                        </div>

                    </div>
                    <label className="block text-2xl font-semibold text-gray-700">Quantity:</label>
                    <div className="flex flex-col items-start mt-4">
                       <div className="flex items-center justify-between h-12 w-auto">
                            <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="text-lg text-gray-400 px-2 bg-[#0348be] hover:bg-[#013396]">
                                -
                            </button>
                            <input value={quantity} onChange={updateQuantity} type="number" min={0}  className="text-center w-12" />
                            <button onClick={() => setQuantity(quantity + 1)} className="text-lg text-gray-400 bg-[#0348be] hover:bg-[#013396]">
                                +
                            </button>
                       </div>
                    </div>
                    <div className="mt-4 flex w-auto gap-x-4">
                        {availableForSale ? (
                            <>
                                <button onClick={handleAddToCart} className={`w-auto text-white px-4 py-2 rounded hover:bg-[#013396] justify-self-start ${quantity === 0 ? 'pointer-events-none bg-[#cbd5e1]' : 'bg-[#0348be]'}`}>
                                    Add to Cart
                                </button>
                            </>
                        ) : (<p className="text-[#cf0000] font-bold">Item is not available for sale</p>) }
                        {checkout && (
                            <Link className="viewCartCta justify-self-start hover:bg-[#013396]" href={`/cart?cartid=${sessionStorage.getItem("cartId")}`}>
                                View Cart
                            </Link>
                        )}
                    </div>
                    {product.variants.edges.length > 1 && (
                            <div className="mb-4 mt-4">
                                <label className="block text-gray-700 mb-2">Choose Variant:</label>
                                <select
                                    value={selectedVariant}
                                    onChange={(e) => changeVariantValue(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-1/2"
                                >
                                    {product.variants.edges.map(edge => (
                                        <option key={edge.node.id} value={edge.node.id}>
                                            {edge.node.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-12">
                <h2 className="text-center text-xl md:text-3xl mb-4 md:mb-8">Related Products</h2>
            </div>

            <div className="productsList px-4 md:px-12 pb-8 md:pb-12">
                {product.collection.reference.products.nodes.map((product) => {
                    return <ProductCard key={product.id} product={product} />;
                })}
            </div>
            
            <div className="flex mx-4 md:mx-12 mb-8 md:mb-12 justify-center">
                <Link href={`/collections/${product.collection.reference.handle}`} className="bg-[#0348be] px-6 py-3 text-white font-bold uppercase rounded">Show More</Link>
            </div>
            
        </div>
    )
}

export default ProductDetails