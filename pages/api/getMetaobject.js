// pages/api/getMetaobject.js
import { getMetaobjectById } from "../../utils/shopify"; // Adjust the path

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { metaobjectId } = req.body;

    if (!metaobjectId) {
      return res.status(400).json({ error: 'Metaobject ID is required' });
    }

    try {
      const metaobject = await getMetaobjectById(metaobjectId);
      res.status(200).json(metaobject);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to fetch metaobject' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
