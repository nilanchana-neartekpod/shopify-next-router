import {
    fetchCustomerAddresses,
    createCustomerAddress,
    deleteCustomerAddress,
    updateCustomerAddress,
  } from "../../utils/shopify";
  
  export default async function handler(req, res) {
    if (req.method === "POST") {
      const { type, accessToken, addressId, addressInput } = req.body;
  
      try {
        if (type === "FETCH_ADDRESSES") {
          const addresses = await fetchCustomerAddresses(accessToken);
          return res.status(200).json({ success: true, addresses });
        }
  
        if (type === "CREATE_ADDRESS") {
          const newAddress = await createCustomerAddress(accessToken, addressInput);
          return res.status(200).json({ success: true, newAddress });
        }
  
        if (type === "DELETE_ADDRESS") {
          const deletedAddressId = await deleteCustomerAddress(accessToken, addressId);
          return res.status(200).json({ success: true, deletedAddressId });
        }
  
        if (type === "UPDATE_ADDRESS") {
          const updatedAddress = await updateCustomerAddress(accessToken, addressId, addressInput);
          return res.status(200).json({ success: true, updatedAddress });
        }
  
        return res.status(400).json({ success: false, message: "Invalid request type" });
      } catch (error) {
        console.error("API Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
  