import { updateCustomerAddress} from "../../utils/shopify";

export default async function handler(req, res) {
  if (req.method === 'POST' && req.body.type === 'UPDATE_ADDRESS') {
    const { customerAccessToken, addressId, addressInput } = req.body;

    console.log('Request to update address:', { customerAccessToken, addressId, addressInput });
    console.log('Incoming request:', req.body);
    if (!customerAccessToken || !addressId || !addressInput) {
      console.error('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    try {
      const updatedAddress = await updateCustomerAddress(customerAccessToken, addressId, addressInput);
      console.log('Updated address data:', updatedAddress);
      res.status(200).json({ updatedAddress: updatedAddress.customerAddress });
    } catch (error) {
      console.error('Error updating address:', error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid request type" });
  }
}
