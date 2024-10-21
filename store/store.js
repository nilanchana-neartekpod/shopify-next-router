import { create } from 'zustand';

const useStore = (set, get) => ({
    quantity: 0,
    cartItems: [],
    cartTotal: async (cartId) => {
        if(cartId){
            let settings = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId: cartId, type: "QTY_UPDATE_HEADER" })
            }
            let response = await fetch('/api/cart', settings);
            let data = await response.json();
            set({ quantity: data.cart.totalQuantity });
            set({cartItems: data.cart.lines.edges});
        }
    }
});

const useGlobalStore = create(useStore);
export default useGlobalStore;