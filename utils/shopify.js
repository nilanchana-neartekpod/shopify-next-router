import { gql, GraphQLClient } from "graphql-request";
const token = process.env.TOKEN;
const endpoint = process.env.SHOPURL;

const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        "X-Shopify-Storefront-Access-Token": token,
    },
});

export async function getProducts() {
    const query = gql`
        {
            products(first: 10) {
                nodes{
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
      return await graphQLClient.request(query);
    } catch (error) {
      throw new Error(error);
    }
}

export const getProduct = async (id) => {
    const productQuery = gql`
        query getProduct($id: ID!) {
            product(id: $id) {
                id
                handle
                title
                description
                priceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                }
                featuredImage {
                    url
                    altText
                }
                variants(first: 10) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    `;
    const variables = {
      id,
    };
    
    try {
      const data = await graphQLClient.request(productQuery, variables);
      return data.product;
    } catch (error) {
      throw new Error(error);
    }
};

export const addToCart = async (itemId, quantity) => {
    const createCartMutation = gql`mutation createCart($cartInput: CartInput){ cartCreate(input: $cartInput){ cart{ id } } }`;
    const variables = { cartInput: { lines: [ { quantity: parseInt(quantity), merchandiseId: itemId } ] } };

    const newClient = new GraphQLClient("https://naveen-theme-spp-extn.myshopify.com/api/2024-07/graphql.json", {
        headers: {
            "X-Shopify-Storefront-Access-Token": "20d63e886174fe2c971fba41226ec126",
        },
    });

    try {
      return await newClient.request(createCartMutation, variables);
    } catch (error) {
      throw new Error(error);
    }
}