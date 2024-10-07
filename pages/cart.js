import Image from "next/image";
import { getCheckoutUrl, retrieveCart } from "../utils/shopify";

export default function Cart({ cart, checkoutUrl }) {
   
    if(Object.keys(cart).length === 0 && cart.constructor === Object){
        return "Empty Cart"
    }

    return (
      <>
        <div className="cart-page">
          <h1>Cart</h1>
          <ul role="list-item">
            {cart.lines.edges.map((item) => {
              return (
                <li key={item.node.id}>
                  <div>
                    <Image
                      src={item.node.merchandise.product.featuredImage.url}
                      alt={item.node.merchandise.product.featuredImage.altText}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>
                    <h2>{item.node.merchandise.product.title}</h2>
                    <p>
                      {
                        item.node.merchandise.product.priceRange.minVariantPrice
                          .amount
                      }
                    </p>
                    <p>Quantity: {item.node.quantity}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="checkout-section">
            <h2>Total - {cart.estimatedCost.totalAmount.amount}</h2>
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