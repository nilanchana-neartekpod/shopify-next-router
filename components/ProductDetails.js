import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { addToCart, updateCart } from "../utils/shopify";
import ProductCard from "@/components/ProductCard";
import ImageGallery from "react-image-gallery";

const ProductDetails = ({product}) => {
    //console.log(JSON.stringify(product,null,2));
    const [quantity, setQuantity] = useState(0);
    const [checkout, setCheckout] = useState(false);

    let imagesArray =  [];
    for(let item of product.images.nodes){
        imagesArray.push({
            original: item.url,
            thumbnail: item.url,
            srcSet:item.url
        });
    }

    const updateQuantity = (e) => {
        if (e && e.target) {
            setQuantity(Number(e.target.value)); // Convert to number
            if (Number(e.target.value) === 0) setCheckout(false); // Update checkout status based on quantity
        }
    };

    const handleAddToCart = async () => {
        let cartId = sessionStorage.getItem("cartId");
        if (quantity > 0) {
          if (cartId) {
            await updateCart(cartId, product.variants.edges[0].node.id, quantity);
            setCheckout(true);
          } else {
            let data = await addToCart(product.variants.edges[0].node.id, quantity);
            cartId = data.cartCreate.cart.id;
            sessionStorage.setItem("cartId", cartId);
            setCheckout(true);
          }
        }
    };

    return (
        <div className="mt-24">
            {checkout ? (
                <div className="px-4 md:px-12">
                    <Link className="viewCartCta" href={`/cart?cartid=${sessionStorage.getItem("cartId")}`}>
                        View Cart
                    </Link>
                </div>
            ) : (
                <></>
            )}
            <div className="product-details px-4 md:px-12 py-8 md:py-12">
                <div className="left">
                    <ImageGallery lazyLoad={true} items={imagesArray} thumbnailPosition={"left"} showFullscreenButton={false} showPlayButton={false} showNav={false} showBullets={true} />
                </div>
                <div className="right md:w-1/2 md:pl-8 mt-6 md:mt-0">
                    <nav className="mb-4 text-sm text-gray-600">
                        <Link href="/">Home</Link> &gt; <Link href="/products">Products</Link> &gt; <span>{product.title}</span>
                    </nav>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                        <h3 className="text-xl text-gray-700 mb-4">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</h3> 

                        <div className="mb-4 flex">
                            {Array.from({ length: Number(product.rating.value) }, (_, i) => 
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                                </svg>
                            )}
                        </div>

                    </div>
                    <label className="block text-2xl font-semibold text-gray-700">Quantity:</label>
                    <div className="flex flex-col items-start mt-4">
                       <div className="flex items-center justify-between h-12 w-auto">
                            <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="text-lg text-gray-400 px-2">
                                -
                            </button>
                            <input value={quantity} onChange={updateQuantity} type="number" min={0}  className="text-center w-12" />
                            <button onClick={() => setQuantity(quantity + 1)} className="text-lg text-gray-400">
                                +
                            </button>
                       </div>
                       <div className="mt-4">
                            <button onClick={handleAddToCart} className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-500">
                                    {quantity === 0 ? "Update Product Quantity" : "Add to Cart"}
                            </button>
                       </div>
                        
                    </div>
                    {product.variants.edges.length > 1 && (
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Choose Variant:</label>
                                <select
                                    value={selectedVariant}
                                    onChange={(e) => setSelectedVariant(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                >
                                    {product.variants.edges.map(edge => (
                                        <option key={edge.node.id} value={edge.node.id}>
                                            {edge.node.product.title}
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
            
            <div class="flex mx-4 md:mx-12 mb-8 md:mb-12 justify-center">
                <Link href='/' className="bg-[#0348be] px-6 py-3 text-white font-bold uppercase rounded">Show More</Link>
            </div>
            
        </div>
    )
}

export default ProductDetails