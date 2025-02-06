import { create } from 'zustand';


const useStore = (set, get) => ({
  
  quantity: 0,
  cartItems: [],
  customerOrders: [],
  wishlist: [],
  customer_Id: null,
  metafieldId: null,
  

  getwishlist: async (user) => {

    if(user && user.accessToken) {
      console.log('Fetching wishlist for user:', user);
  
      let settings = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: user.accessToken }),
      };
  
      try {
        const response = await fetch('/api/getCustomerAddresses', settings);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
        }
  
        const data = await response.json();
        // console.log('Data:', data);
        // console.log("Customer:", data?.addresses?.customer);
        // console.log("Metafield:", data?.addresses?.customer?.wishlist);
        // console.log("Wishlist", JSON.parse(data?.addresses?.customer?.wishlist.value));
        

        const metafield = data.addresses?.customer?.wishlist;
          if (metafield) {
            set({ metafieldId: metafield.id });
            set({ customer_Id: data.addresses.customer.id });
            set({ wishlist: JSON.parse(metafield.value)?.wishlist });
          }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    } else {
      console.warn('No valid user or access token provided to fetch wishlist.');
    }
  },
  
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
  setCustomerOrders: (data) => {
    set({customerOrders: data});
  },
  
  setWishlist: (data) => {
    console.log('Setting wishlist with data:', data); // Log the wishlist data
    set({ wishlist: data });
  },
});

const useGlobalStore = create(useStore);
export default useGlobalStore;
