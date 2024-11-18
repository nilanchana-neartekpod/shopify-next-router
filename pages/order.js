import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Order = () => {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Access the order data passed as state
    if (router.query && router.query.order) {
      setOrder(router.query.order);
    } else if (router.query && router.asPath.includes('order')) {
      const state = window.history.state?.options?.state;
      if (state && state.order) {
        setOrder(state.order);
      }
    }
  }, [router.query]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6  rounded-md shadow-md">
      {/* Render order details as before */}
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="my-4 p-4 border rounded-md shadow-sm">
        <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
        <p>Placed on: {new Date(order.processedAt).toLocaleDateString()}</p>
        <p>Status: {order.financialStatus}</p>
        <p>Total Price: {order.currentTotalPrice.amount} {order.currentTotalPrice.currencyCode}</p>
        <p>Subtotal: {order.currentSubtotalPrice.amount} {order.currentSubtotalPrice.currencyCode}</p>
        <p>Total Tax: {order.currentTotalTax.amount} {order.currentTotalTax.currencyCode}</p>

        <h3 className="text-lg font-semibold mt-4">Billing Address:</h3>
        <p>{order.billingAddress?.name}</p>
        <p>{order.billingAddress?.address1}</p>
        <p>{order.billingAddress?.city}, {order.billingAddress?.province}, {order.billingAddress?.country}</p>

        <h3 className="text-lg font-semibold mt-4">Items:</h3>
        <ul className='pl-4 list-disc'>
          {order.lineItems.edges.map((item, idx) => (
            <li key={idx}>
              {item.node.title} - {item.node.variant.price.amount} {item.node.variant.price.currencyCode} (Quantity: {item.node.currentQuantity})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Order;
