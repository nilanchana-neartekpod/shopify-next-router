// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { retrieveCart, removeFromCart, addToCart, updateCart } from "../../utils/shopify";

export default async function handler(req, res) {
  console.log("Incoming API request:", req.body);
  if (req.method === 'POST' && req.body.type === 'QTY_UPDATE_HEADER') {
    
    let {cartId} = req.body;
    let cartData = await retrieveCart(cartId);
    res.status(200).json({cart:cartData});

  } else if(req.method === 'POST' && req.body.type === 'REMOVE_QTY'){
    
    let {cartId, lineId} = req.body;
    let resp = await removeFromCart(cartId, lineId);
    res.status(200).json({ cart:resp.cartLinesRemove.cart });
  
  } else if(req.method === 'POST' && req.body.type === 'ADD_TO_CART'){

    let {varId, quantity, sellingPlanId, attributes} = req.body;
    console.log("Received attributes in API:", attributes);
    let data = await addToCart(varId, quantity, sellingPlanId, attributes);
    console.log("Shopify Response from addToCart:", data);
    res.status(200).json({ cartId: data.cartCreate.cart.id });
  
  } else if(req.method === 'POST' && req.body.type === 'UPDATE_CART'){

    let {cartId, varId, quantity, sellingPlanId, attributes} = req.body;
    let data = await updateCart(cartId, varId, quantity, sellingPlanId, attributes);
    res.status(200).json({ cartId: data.cartLinesAdd.cart.id });

  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
