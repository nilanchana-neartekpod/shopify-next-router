// pages/api/add-to-cart.js
const { gql } = require("graphql-request");
const shopifyClient = require("../../lib/shopifyClient");

export default async function handler(req, res) {
  const { itemId, quantity } = req.body;

  const createCartMutation = gql`
    mutation createCart($cartInput: CartInput) {
      cartCreate(input: $cartInput) {
        cart {
          id
        }
      }
    }
  `;

  const variables = {
    cartInput: {
      lines: [{ quantity: parseInt(quantity), merchandiseId: itemId }],
    },
  };

  try {
    const data = await shopifyClient.request(createCartMutation, variables);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
