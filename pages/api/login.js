// pages/api/login.js
import { customerLogin } from '../../utils/shopify';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log("Sent",email, password);
    

    try {
      const result = await customerLogin(email, password);

      // Extract the first name from the email
      const Name = email.match(/^[a-zA-Z]+/)[0];

      const userData = {
        accessToken: result.accessToken,
        expiresAt: result.expiresAt,
        email: result.email,
        Name, 
      };

      return res.status(200).json(userData); // Send the full userData
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
