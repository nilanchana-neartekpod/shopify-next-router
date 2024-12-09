import {  updateMetafield } from '../../utils/shopify';

export default async function handler(req, res) {
    console.log('API Request:', req.method, req.body); // Debugging
    
    if (req.method === 'POST' ) {
      try {
        const { wishlist } = req.body;
        await updateMetafield(wishlist);
        console.log('Metafield update response:', response);
        res.status(200).json({ message: 'Wishlist updated successfully', data: response });      } catch (error) {
        console.error('Error updating wishlist:', error);
        res.status(500).json({ success: false,error: error.message });
      }
    } else {
      res.status(405).json({success: false, error: 'Method Not Allowed' });
    }
  }
  
  