import { gql, GraphQLClient } from "graphql-request";
// import shopifyClient from "../../lib/shopifyClient";
// const endpoint = "https://jeevshops.myshopify.com/api/2024-04/graphql.json";
// const token = "ae560a8547f6aa13291ebdecb6f689c3";

const token = "20d63e886174fe2c971fba41226ec126";
const endpoint =
  "https://naveen-theme-spp-extn.myshopify.com/api/2024-07/graphql.json";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

export default async function handler(req, res) {
  console.log("first");
  const query = gql`
    {
      products(first: 20) {
        nodes {
          title
          id
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          featuredImage {
            altText
            url
          }
          variants(first: 10) {
            edges {
              node {
                id
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query);
    console.log(data, "data");
    res.status(200).send(data.products.nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
