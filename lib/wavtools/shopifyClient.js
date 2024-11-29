import { GraphQLClient } from "graphql-request";

const endpoint = "https://jeevshops.myshopify.com/api/2024-04/graphql.json";
const token = "ae560a8547f6aa13291ebdecb6f689c3";

const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

module.exports = shopifyClient;
