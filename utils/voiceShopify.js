import Fuse from "fuse.js";
import { gql, GraphQLClient } from "graphql-request";

const token = "20d63e886174fe2c971fba41226ec126" || "";
const endpoint =
  "https://naveen-theme-spp-extn.myshopify.com/api/2024-04/graphql.json" || "";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

// let cart = [];
// let cart_total = 0;
let products = [];
let fuse = null;

export default async function getProducts() {
  const products = gql`
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
    const data = await graphQLClient.request(products);
    // console.log("data", data);
    return data.products.nodes;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
}

export const addToCart = async (itemId, quantity) => {
  console.log(itemId, quantity);
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
    const addtocartdata = await graphQLClient.request(
      createCartMutation,
      variables
    );
    console.log(addtocartdata, "addtocart");
    return addtocartdata;
  } catch (error) {
    throw new Error(error);
  }
};

export async function updateCart(cartId, itemId, quantity) {
  console.log(cartId, itemId, quantity);
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
    const data = await graphQLClient.request(updateCartMutation, variables);
    console.log(data, "data");
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function retrieveCart(cartId) {
  console.log(cartId, "retriviw cart");
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
    console.log(data, "backend data");
    const transformedCart = {
      cartId: data.cart.id,
      totalAmount: data.cart.estimatedCost.totalAmount,
      productDetails: data.cart.lines.edges.map((item) => {
        const products = item.node;
        return {
          cartLineId: products.id, // Product ID
          productVarientId: products.merchandise.id, // Product Title
          quantity: products.quantity, // Quantity
          featuredImage: products.merchandise.product.featuredImage.url, // Image URL
          ProductId: products.merchandise.product.id, // Image URL
          productHandle: products.merchandise.product.handle,
          productName: products.merchandise.product.title,
          price: products.merchandise.product.priceRange.minVariantPrice.amount, // Price
        };
      }),
    };
    return transformedCart;
  } catch (error) {
    throw new Error(error);
  }
}

export const removeCartLines = async (cartId, lineIds) => {
  const removeCartProduct = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineIds],
  };
  try {
    const data = await graphQLClient.request(removeCartProduct, variables);
    console.log(data, "response");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createCheckout = async (lineItems) => {
  const query = gql`
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
              }
            }
          }
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
      buyerIdentity: {
        countryCode: "IN",
      },
      lineItems: formattedLineItems,
    },
  };

  try {
    const response = await graphQLClient.request(query, variables);
    return response;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};

const initialize = async () => {
  try {
    products = await getProducts(); // Fetch products asynchronously
    fuse = new Fuse(products, {
      keys: ["title"], // Adjust based on your product structure
      minMatchCharLength: 4, // Minimum length of words to match
      includeScore: true,
      // threshold: 0.2,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
initialize();

export const product_search = (query) => {
  console.log("Searching for:", query);

  if (!fuse) {
    console.error("Fuse has not been initialized");
    return []; // Return an empty array if Fuse is not initialized
  }

  const results = fuse.search(query);

  console.log("Search results:", results);

  // Check if there are any results
  if (results.length > 0) {
    return results.map((result) => ({
      title: result.item.title,
      itemId: result.item.id,
      unit_price: result.item.priceRange.minVariantPrice.amount,
      featuredImage: result.item.featuredImage.url,
      product_variant_id: result.item.variants.edges[0].node.id,
    }));
  } else {
    return [{ message: "No data found" }];
  }
};
