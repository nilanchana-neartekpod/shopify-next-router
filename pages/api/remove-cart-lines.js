// pages/api/remove-cart-lines.js
const { gql } = require("graphql-request");
const shopifyClient = require("../../lib/shopifyClient");

export default async function handler(req, res) {
  const { cartId, lineIds } = req.body;

  const removeCartMutation = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineIds],
  };

  try {
    const data = await shopifyClient.request(removeCartMutation, variables);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
