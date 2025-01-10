import { getMetaobjectById, getMetaobjectByType } from "../../utils/shopify"; // Adjust the path

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { metaobjectId, metaobjectType } = req.body;

    if (metaobjectId) {
      // Fetch metaobject by ID
      try {
        const metaobject = await getMetaobjectById(metaobjectId);
        res.status(200).json(metaobject);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch metaobject by ID' });
      }
    } else if (metaobjectType) {
      // Fetch metaobjects by Type
      try {
        const metaobjects = await getMetaobjectByType(metaobjectType);
        res.status(200).json(metaobjects);
      } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch metaobjects by Type' });
      }
    } else {
      return res.status(400).json({ error: 'Either metaobjectId or metaobjectType is required' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
