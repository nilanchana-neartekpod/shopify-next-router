import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { addToCart } from "../utils/shopify";

const ProductDetails = ({product}) => {
    //console.log(JSON.stringify(product,null,2));
    const [quantity, setQuantity] = useState(0);
    const [checkout, setCheckout] = useState(false);

    const updateQuantity = (e) => {
        setQuantity(e.target.value);
        if (quantity == 0) setCheckout(false);
    };

    const handleAddToCart = async () => {
        let cartId = sessionStorage.getItem("cartId");
        if (quantity > 0) {
          if (cartId) {
            await updateCart(cartId, product.variants.edges[0].node.id, quantity);
          } else {
            let data = await addToCart(product.variants.edges[0].node.id, quantity);
            cartId = data.cartCreate.cart.id;
            sessionStorage.setItem("cartId", cartId);
          }
        }
    };

    return (
        <>
            {checkout ? (
                <Link href={`/cart?cartid=${sessionStorage.getItem("cartId")}`}>
                    Checkout
                </Link>
            ) : (
                <></>
            )}
            <div className="product-details">
                <div className="left">
                    <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText}
                        fill={true}
                    />
                </div>
                <div className="right">
                    <span>
                        <h2>{product.title}</h2>
                        <h3>{product.priceRange.minVariantPrice.amount}</h3>
                    </span>
                    <input
                        value={quantity}
                        onChange={updateQuantity}
                        type="number"
                        min={0}
                    />
                    <button onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </>
    )
}

export default ProductDetails