import { createCustomerSub } from "../../utils/shopify";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body; 
    try {
        const newCustomer = await createCustomerSub(email);
        return res.status(200).json({ success: true, newCustomer });

    } catch (error) {
      console.error("Error creating customer:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
