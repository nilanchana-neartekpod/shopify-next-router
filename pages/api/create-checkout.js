// pages/api/create-checkout.js
const { gql } = require("graphql-request");
const shopifyClient = require("../../lib/shopifyClient");

export default async function handler(req, res) {
  const { lineItems } = req.body;

  const checkoutMutation = gql`
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLineItems = lineItems.map((item) => ({
    quantity: 1,
    variantId: item,
  }));

  const variables = {
    input: {
      allowPartialAddresses: true,
      buyerIdentity: { countryCode: "IN" },
      lineItems: formattedLineItems,
    },
  };

  try {
    const data = await shopifyClient.request(checkoutMutation, variables);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
