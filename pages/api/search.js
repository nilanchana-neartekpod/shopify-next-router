import { searchProducts } from "../../utils/shopify"; // Adjust file path
 
export default async function handler(req, res) {

  if (req.method === 'POST' && req.body.type === 'SEARCH_PRODUCTS') {

    // Extract the search query from the request body

    const { searchQuery } = req.body;

    try {

      // Call the searchProducts function with the provided query

      const searchResults = await searchProducts(searchQuery);

      // Respond with the search results

      res.status(200).json({ products: searchResults.edges.map(edge => edge.node) });

    } catch (error) {

      // Handle errors and respond accordingly

      res.status(500).json({ error: "Error fetching products", details: error.message });

    }
 
  } else {

    res.status(405).json({ error: "Method Not Allowed" });

  }

}

 