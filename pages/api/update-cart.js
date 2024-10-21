// pages/api/update-cart.js
const { gql } = require("graphql-request");
const shopifyClient = require("../../lib/shopifyClient");

export default async function handler(req, res) {
  const { cartId, itemId, quantity } = req.body;

  const updateCartMutation = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `;

  const variables = {
    cartId: cartId,
    lines: [
      {
        quantity: parseInt(quantity),
        merchandiseId: itemId,
      },
    ],
  };

  try {
    const data = await shopifyClient.request(updateCartMutation, variables);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
