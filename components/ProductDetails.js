import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { addToCart, updateCart } from "../utils/shopify";

const ProductDetails = ({product}) => {
    //console.log(JSON.stringify(product,null,2));
    const [quantity, setQuantity] = useState(0);
    const [checkout, setCheckout] = useState(false);

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
                    {product.featuredImage?.url ? (
                        <>
                            <Image src={product.featuredImage?.url} alt={product.featuredImage?.alttext} fill={true} />
                        </>
                    ) : (
                        <>
                            <Image src="https://dummyimage.com/1200/09f/fff.png" alt={product.title} fill={true} />
                        </>
                    )}
                </div>
                <div className="right md:w-1/2 md:pl-8 mt-6 md:mt-0">
                    <nav className="mb-4 text-sm text-gray-600">
                        <Link href="/">Home</Link> &gt; <Link href="/products">Products</Link> &gt; <span>{product.title}</span>
                    </nav>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                        <h3 className="text-xl text-gray-700 mb-4">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</h3>
                    </div>
                    <label className="block text-2xl font-semibold text-gray-700 mb-2">Quantity:</label>
                    <div className="flex flex-col items-start mt-4">
                       <div className="flex items-center justify-between border border-gray-300 h-12 w-40">
                            <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="text-lg text-gray-400 px-2">
                                -
                            </button>
                            <input value={quantity} onChange={updateQuantity} type="number" min={0}  className="text-center w-12" />
                            <button onClick={() => setQuantity(quantity + 1)} className="text-lg text-gray-400">
                                +
                            </button>
                       </div>
                       <div className="mt-2 ">
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
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold mb-2">About this Item</h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails