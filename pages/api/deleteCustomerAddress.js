import { deleteCustomerAddress } from '../../utils/shopify'; // Import the correct function

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { accessToken, addressId } = req.body;
    console.log('Request received to delete address:', { accessToken, addressId });

    if (!accessToken || !addressId) {
        console.error('Missing accessToken or addressId');
      return res.status(400).json({ message: 'Access token and address ID are required' });
    }

    try {
      // Delete the address using the provided access token and address ID
      const deletedAddressId = await deleteCustomerAddress(accessToken, addressId);
      console.log('Deleted address ID:', deletedAddressId);
      // Send success response with the deleted address ID
      return res.status(200).json({ message: 'Address deleted successfully', deletedAddressId });
    } catch (error) {
      console.error('Error deleting address:', error.message);
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
