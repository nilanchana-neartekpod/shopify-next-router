import { gql, GraphQLClient } from "graphql-request";
const token = process.env.TOKEN;
const endpoint = process.env.SHOPURL;

const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
    },
});

export async function getProducts(count) {
    const query = gql`
        {
            products(first: ${count}) {
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
                images(first: 50) {
                  nodes {
                    url
                  }
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

    let newClient = new GraphQLClient("https://naveen-theme-spp-extn.myshopify.com/api/2024-07/graphql.json", {
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

export async function updateCart(cartId, itemId, quantity) {
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

    let newClient = new GraphQLClient("https://naveen-theme-spp-extn.myshopify.com/api/2024-07/graphql.json", {
        headers: {
            "X-Shopify-Storefront-Access-Token": "20d63e886174fe2c971fba41226ec126",
        },
    });
  
    try {
      const data = await newClient.request(updateCartMutation, variables);
      return data;
    } catch (error) {
      throw new Error(error);
    }
}

export async function retrieveCart(cartId) {
    const cartQuery = gql`
      query cartQuery($cartId: ID!) {
        cart(id: $cartId) {
          id
          createdAt
          updatedAt
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
    const variables = {
      cartId,
    };
    try {
      const data = await graphQLClient.request(cartQuery, variables);
      return data.cart;
    } catch (error) {
      throw new Error(error);
    }
}

export const getCheckoutUrl = async (cartId) => {
    const getCheckoutUrlQuery = gql`
      query checkoutURL($cartId: ID!) {
        cart(id: $cartId) {
          checkoutUrl
        }
      }
    `;
    const variables = {
      cartId: cartId,
    };
  
    try {
      return await graphQLClient.request(getCheckoutUrlQuery, variables);
    } catch (error) {
      throw new Error(error);
    }
};

export async function getCollections() {
  const query = gql`
      {
        collections(first: 3) {
          nodes{
              title
              id
              handle
              image {
                  altText
                  url
              }
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