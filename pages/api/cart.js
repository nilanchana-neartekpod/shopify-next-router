// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { retrieveCart } from "../../utils/shopify";
export default async function handler(req, res) {
  if (req.method === 'POST') {
    let {cartId} = req.body;
    let cartData = await retrieveCart(cartId);
    let _qty = 0;
    if(cartData.lines){
      cartData.lines.edges.forEach((item) => {
        _qty += item.node.quantity;
      });
    }
    res.status(200).json({qty:_qty});
  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
