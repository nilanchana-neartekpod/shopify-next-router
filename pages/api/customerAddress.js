import { createCustomerAddress } from "../../utils/shopify";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { customerAccessToken, addressInput } = req.body;

    console.log("API Request Body:", req.body); // Log the request body for debugging

    if (!customerAccessToken || !addressInput) {
      console.error("Missing required fields");
      return res.status(400).json({ message: "Access token and address input are required" });
    }

    try {
      const createdAddress = await createCustomerAddress(customerAccessToken, addressInput);
      console.log("Created Address:", createdAddress); // Log the created address
      res.status(200).json({ createdAddress });
    } catch (error) {
      console.error("Error in API:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}