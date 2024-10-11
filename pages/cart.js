import Image from "next/image";
import { getCheckoutUrl, retrieveCart } from "../utils/shopify";

export default function Cart({ cart, checkoutUrl }) {
   
    if(Object.keys(cart).length === 0 && cart.constructor === Object){
      return "Empty Cart"
    }

    return (
      <>
        <div className="cart-page mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
          <ul role="list-item" className="space-y-6">
            {cart.lines.edges.map((item) => {
              return (
                <li key={item.node.id} className="flex items-center gap-6 border-b pb-6">
                  <div className="w-32 h-32">
                    <Image
                      src={item.node.merchandise.product.featuredImage.url}
                      alt={item.node.merchandise.product.featuredImage.altText}
                      className="object-cover rounded-md"
                      width={128}
                      height={128}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.node.merchandise.product.title}</h2>
                    <p className="text-lg text-gray-600 mt-2">
                      { item.node.merchandise.product.priceRange.minVariantPrice.amount} ₹
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.node.quantity}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="checkout-section mt-10 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Total - {cart.estimatedCost.totalAmount.amount} ₹</h2>
            <a href={checkoutUrl}>
                <button className="checkout-button">Checkout</button>
            </a>
          </div>
        </div>
      </>
    );
}

export const getServerSideProps = async (context) => {
    
    const { cartid } = context.query;
    //Missing Cart ID
    if(!cartid){
        return {
            props: {
                cart: {},
                checkoutUrl: ""
            }
        }
    }

    const cart = await retrieveCart(cartid);
    //Missing Cart
    if(Object.keys(cart).length === 0 && cart.constructor === Object){
        return {
            props: {
                cart: {},
                checkoutUrl: ""
            }
        }
    }

    const data = await getCheckoutUrl(cartid);
    //Missing URL
    if(!data.cart){
        return {
            props: {
                cart: {},
                checkoutUrl: ""
            }
        }
    }
    const { checkoutUrl } = data.cart;
    
    return {
      props: {
        cart,
        checkoutUrl,
      },
    };
};