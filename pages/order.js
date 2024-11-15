import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Order = () => {
  const router = useRouter();
  const { order } = router.query; // Accessing the order query parameter
  const [parsedOrder, setParsedOrder] = useState(null);

  useEffect(() => {
    if (order) {
      try {
        const parsed = JSON.parse(order); // Parse the order from query
        setParsedOrder(parsed); // Store the parsed order in state
      } catch (error) {
        console.error("Error parsing order data:", error);
      }
    }
  }, [order]); // Re-run effect when order changes

  if (!parsedOrder) {
    return <p>Loading...</p>; // Show loading until the order data is parsed
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6  rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="my-4 p-4 border rounded-md shadow-sm">
        <h2 className="text-lg font-semibold">Order #{parsedOrder.orderNumber}</h2>
        <p>Placed on: {new Date(parsedOrder.processedAt).toLocaleDateString()}</p>
        <p>Status: {parsedOrder.financialStatus}</p>
        <p>
          Total Price: {parsedOrder.currentTotalPrice.amount} {parsedOrder.currentTotalPrice.currencyCode}
        </p>
        <p>
          Subtotal: {parsedOrder.currentSubtotalPrice.amount} {parsedOrder.currentSubtotalPrice.currencyCode}
        </p>
        <p>
          Total Tax: {parsedOrder.currentTotalTax.amount} {parsedOrder.currentTotalTax.currencyCode}
        </p>

        <h3 className="text-lg font-semibold mt-4">Billing Address:</h3>
        <p>{parsedOrder.billingAddress?.name}</p>
        <p>{parsedOrder.billingAddress?.address1}</p>
        <p>
          {parsedOrder.billingAddress?.city}, {parsedOrder.billingAddress?.province}, {parsedOrder.billingAddress?.country}
        </p>

        <h3 className="text-lg font-semibold mt-4">Items:</h3>
        <ul className='pl-4 list-disc'>
          {parsedOrder.lineItems.edges.map((item, idx) => (
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
