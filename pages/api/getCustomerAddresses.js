// pages/api/getCustomerAddresses.js
import { fetchCustomerAddresses } from '../../utils/shopify'; // Import the correct function
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { customerAccessToken } = req.body;

    if (!customerAccessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    try {
      // Fetch addresses using the access token
      const addressData = await fetchCustomerAddresses(customerAccessToken);
      console.log( "data ", addressData); 
      // Send the data as the response
      return res.status(200).json({ addresses: addressData });
    } catch (error) {
      console.error('Error fetching addresses:', error.message);
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
