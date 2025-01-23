// pages/api/create-metaobject.js
import { createMetaobject } from '../../utils/shopify';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fields } = req.body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    try {
      // Call the createMetaobject function with the provided fields
      const metaobjectFields = await createMetaobject(fields);

      // Return the created metaobject fields to the frontend
      return res.status(200).json({ metaobjectFields });
    } catch (error) {
      // Return error if something goes wrong
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
