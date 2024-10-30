import { create } from 'zustand';

const useStore = (set, get) => ({
  quantity: 0,
  cartItems: [],
  cartTotal: async (cartId) => {
    if (cartId) {
      console.log('Fetching cart data for cart ID:', cartId);
      
      let settings = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cartId, type: "QTY_UPDATE_HEADER" }),
      };

      try {
        let response = await fetch('/api/cart', settings);
        let data = await response.json();
        console.log('Cart Data:', data);

        set({ quantity: data.cart.totalQuantity });
        set({ cartItems: data.cart.lines.edges });
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    } else {
      console.warn('No cart ID provided to fetch cart data.');
    }
  },
});

const useGlobalStore = create(useStore);
export default useGlobalStore;
