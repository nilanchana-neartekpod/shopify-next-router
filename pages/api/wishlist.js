import {  updateMetafield } from '../../utils/shopify';

export default async function handler(req, res) {    
    if (req.method === 'POST' ) {
      try {
        const { customer_Id, metafieldId, wishlistValue } = req.body;
        console.log('Request to update wishlist:', req.body);
        if (!customer_Id || !metafieldId || !wishlistValue) {
          console.error('Missing required fields');
          return res.status(400).json({ message: 'All fields are required' });
        }

        const response = await updateMetafield(customer_Id, metafieldId, wishlistValue);
        console.log('Metafield update response:', response);
        res.status(200).json({ message: 'Wishlist updated successfully', data: response });     
       } catch (error) {
        console.error('Error updating wishlist:',error.message);
        res.status(500).json({ success: false,error: error.message });
      }
    } else {
      res.status(405).json({success: false, error: 'Method Not Allowed' });
    }
  }
