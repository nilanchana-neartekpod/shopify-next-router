import { updateAddress } from "../../utils/shopify";

export default async function handler(req, res) {
  if (req.method === 'POST' && req.body.type === 'UPDATE_ADDRESS') {
    const { customerAccessToken, addressId, addressInput } = req.body;

    try {
      const updatedAddress = await updateAddress(customerAccessToken, addressId, addressInput);
      res.status(200).json({ updatedAddress: updatedAddress.customerAddress });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid request type" });
  }
}
