// pages/api/retrieve-cart.js
const { gql } = require("graphql-request");
const shopifyClient = require("../../lib/shopifyClient");

export default async function handler(req, res) {
  const { cartId } = req.query;

  const cartQuery = gql`
    query cartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                    priceRange {
                      minVariantPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
          }
        }
      }
    }
  `;

  const variables = { cartId };

  try {
    const data = await shopifyClient.request(cartQuery, variables);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
