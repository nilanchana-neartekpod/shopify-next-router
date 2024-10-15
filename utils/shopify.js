import { gql, GraphQLClient } from "graphql-request";
const token = process.env.TOKEN;
const endpoint = process.env.SHOPURL;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: { "X-Shopify-Storefront-Access-Token": token, "Content-Type": "application/json" }
});

export async function searchProducts(queryString) {
  const query = gql`
    {
      products(first: 10, query: "${queryString}") {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              altText
              url
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
 
  try {
    const data = await graphQLClient.request(query);
    return data.products;
  } catch (error) {
    throw new Error(error);
  }
}
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

export async function getCollectionProducts(handle) {
  const query = gql`
    {
      collectionByHandle(handle: "${handle}"){
        title
        products(first: 250) {
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
                rating: metafield(key: "rating", namespace: "custom") {
                  value
                }
                collection: metafield(key: "collection", namespace: "custom") {
                  reference {
                    ... on Collection {
                      id
                      handle
                      title
                      products(first: 4) {
                        nodes {
                          featuredImage {
                            url
                          }
                          id
                          handle
                          title
                          priceRange {
                              minVariantPrice {
                                  amount
                                  currencyCode
                              }
                          }
                        }
                      }
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

    try {
      return await graphQLClient.request(createCartMutation, variables);
    } catch (error) {
      throw new Error(error);
    }
}

export async function updateCart(cartId, itemId, quantity) {
    const updateCartMutation = gql`mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id } } }`;
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
      const data = await graphQLClient.request(updateCartMutation, variables);
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
          totalQuantity
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
    const getCheckoutUrlQuery = gql`query checkoutURL($cartId: ID!) { cart(id: $cartId) { checkoutUrl } }`;
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

export async function removeFromCart(cartId, lineId) {
  const updateCartMutation = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          totalQuantity
          createdAt
          updatedAt
          checkoutUrl
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
    }
  `;

  const variables = { cartId: cartId, lineIds: [lineId] };
  try {
    const data = await graphQLClient.request(updateCartMutation, variables);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}