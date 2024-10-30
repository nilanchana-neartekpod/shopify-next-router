// Example usage in an API route (pages/api/login.js)
import { customerLogin } from '../../utils/shopify';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const accessToken = await customerLogin(email, password);
      return res.status(200).json(accessToken);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
