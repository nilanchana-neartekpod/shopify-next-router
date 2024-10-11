// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { retrieveCart,removeFromCart } from "../../utils/shopify";

export default async function handler(req, res) {
  if (req.method === 'POST' && req.body.type === 'QTY_UPDATE_HEADER') {
    
    let {cartId} = req.body;
    let cartData = await retrieveCart(cartId);
    res.status(200).json({qty:cartData.totalQuantity});

  } else if(req.method === 'POST' && req.body.type === 'REMOVE_QTY'){
    
    let {cartId, lineId} = req.body;
    let resp = await removeFromCart(cartId, lineId);
    res.status(200).json({ cart:resp.cartLinesRemove.cart });

  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
