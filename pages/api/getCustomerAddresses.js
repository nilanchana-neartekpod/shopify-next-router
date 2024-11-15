import { fetchCustomerAddresses } from '../../utils/shopify'; // Import the correct function

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    try {
      // Fetch addresses using the access token
      const addressData = await fetchCustomerAddresses(accessToken);
      
      // Log the data structure for inspection
      //console.log('Address Data Structure:', JSON.stringify(addressData, null, 2));

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