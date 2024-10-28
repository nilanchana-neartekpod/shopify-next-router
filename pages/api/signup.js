// pages/api/signup.js
import { createCustomer } from '../../utils/shopify';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

    try {
      // Input to be passed to the createCustomer function
      const input = {
        firstName,
        lastName,
        email,
        password,
      };

      // Create customer using the Shopify API
      const customer = await createCustomer(input);

      // Return the created customer data to the frontend
      return res.status(200).json({ customer });
    } catch (error) {
      // Return error if something goes wrong
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
 