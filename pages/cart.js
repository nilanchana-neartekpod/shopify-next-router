import Image from "next/image";
import { getCheckoutUrl, retrieveCart } from "../utils/shopify";
import { ImBin } from "react-icons/im";
import useGlobalStore from '../store/store'
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Cart({ cart, checkoutUrl }) {
    const cartTotal = useGlobalStore((state) => state.cartTotal);
   
    if(Object.keys(cart).length === 0 && cart.constructor === Object){
      return <div className="mt-20 px-4 md:px-12 py-8 md:py-12 text-center font-bold text-2xl md:text-3xl">Empty Cart: <Link className="underline text-[#0348be]" href='/products'>Continue shopping</Link></div>
    }

    let [icart, setIcart] = useState(cart);
    let [curl, setCurl] = useState(checkoutUrl);

    const removeCartItem = async (lineId, cartId) => {
      let settings = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, lineId, type: 'REMOVE_QTY' })
      }
      let response = await fetch('/api/cart', settings);
      let data = await response.json();
      if(data.cart){
        let { id } = data.cart;
        cartTotal(id);
      }

      setCurl(data.cart.checkoutUrl);
      setIcart(data.cart);
    }

    if(icart.lines.edges.length === 0){window.history.pushState({}, document.title, window.location.pathname); sessionStorage.clear();}
    if(icart.lines.edges.length === 0) return <div className="mt-20 px-4 md:px-12 py-8 md:py-12 text-center font-bold text-2xl md:text-3xl">Empty Cart: <Link className="underline text-[#0348be]" href='/products'>Continue shopping</Link></div>
   
    return (
      <>
        <div className="cart-page mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
          <ul role="list-item" className="space-y-6">
            {icart.lines.edges.map((item) => {
              return (
                <li key={item.node.id} className="flex items-center gap-6 border-b pb-6">
                  <div className="w-32 h-32">
                    <Image
                      src={item.node.merchandise.product.featuredImage.url}
                      alt={item.node.merchandise.product.title}
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
                  <div className="remove-cart-item">
                    <ImBin className="text-[red] cursor-pointer" onClick={() => removeCartItem(item.node.id, cart.id)} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="checkout-section mt-10 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Total - {icart.estimatedCost.totalAmount.amount} ₹</h2>
            <a className="checkout-button" href={curl}>
              Checkout
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