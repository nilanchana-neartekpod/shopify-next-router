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
export async function createCustomer(input) {
  const mutation = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          firstName
          lastName
          email
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const variables = {input};
    const data = await graphQLClient.request(mutation, variables);

    if (data.customerCreate.customerUserErrors.length > 0) {
      throw new Error(
        `Error creating customer: ${data.customerCreate.customerUserErrors[0].message}`
      );
    }

    // Return the created customer data
    return data.customerCreate.customer;
  } catch (error) {
    throw new Error(error.message || "Error creating customer");
  }
}
export async function customerLogin(email, password) {
  const mutation = gql`
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    const data = await graphQLClient.request(mutation, variables);

    if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
      throw new Error(
        `Error logging in: ${data.customerAccessTokenCreate.customerUserErrors[0].message}`
      );
    }

    return {
      accessToken: data.customerAccessTokenCreate.customerAccessToken.accessToken,
      expiresAt: data.customerAccessTokenCreate.customerAccessToken.expiresAt,
      email: email,
    };
  } catch (error) {
    throw new Error(error.message || 'Error logging in customer');
  }
}
export async function getMetaobjectById(metaobjectId) {
  const query = gql`{
    metaobject(id: "gid://shopify/Metaobject/${metaobjectId}") {
        id
        handle
        fields {
          key
          value
          reference{
            ... on MediaImage{
              image{
                url
              }
            }
          }
        }
      }
    }
  `;

  const variables = { id: metaobjectId };

  try {
    const data = await graphQLClient.request(query, variables);
    return data.metaobject;
  } catch (error) {
    throw new Error(error.message || "Error retrieving metaobject");
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
                    collections(first: 50){
                      nodes{
                        title
                      }
                    }
                    featuredImage {
                        altText
                        url
                    }
                    rating: metafield(key: "rating", namespace: "custom") {
                      value
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

export async function fetchCustomerAddresses(accessToken) {
  const query = gql`
    query getCustomerAddresses($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
        addresses(first: 10) {
         nodes {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
        orders(first: 10) {
          edges {
            node {
              id
              name
              orderNumber
              processedAt
              billingAddress {
                name
                address1
                city
                province
                country
                zip
                phone
              }
              totalShippingPrice{
                amount
                currencyCode
              }
              currentTotalTax{
                amount
                currencyCode
              }
              currencyCode
              currentSubtotalPrice {
                amount
                currencyCode
              }
              financialStatus
              lineItems(first: 10) {
                edges {
                  node {
                    currentQuantity
                    title
                    variant{
                      title
                      sku
                      price{
                        amount
                        currencyCode
                      }
                      product{
                        featuredImage{
                          url
                        }
                      }
                      image{
                        url
                      }
                    }
                  }
                }
              }
              currentTotalPrice {
                amount
                currencyCode
              }

            }
          }
        }
      }
    }
  `;

  const variables = {
    customerAccessToken: accessToken,
  };

  try {
    const data = await graphQLClient.request(query, variables);
    console.log("Shopify Response Data:", data);
    return data;  // Returns the list of addresses
  } catch (error) {
    throw new Error(error.message || 'Error fetching customer addresses');
  }
}
export async function updateAddress(customerAccessToken, addressId, addressInput) {
  const updateAddressMutation = gql`
    mutation customerAddressUpdate($customerAccessToken: String!, $addressId: ID!, $address: CustomerAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $addressId, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const variables = {
    customerAccessToken: customerAccessToken,
    addressId: addressId,
    address: addressInput,
  };

  try {
    const data = await graphQLClient.request(updateAddressMutation, variables, {
      Authorization: `Bearer ${customerAccessToken}`, // Ensure the token is included in the headers
    });
    return data;
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
                rating: metafield(key: "rating", namespace: "custom") {
                  value
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
                options(first: 100){
                  name
                  optionValues{
                    name
                  }
                }
                variants(first: 100) {
                    edges {
                        node {
                            id
                            title
                            quantityAvailable
                            availableForSale
                            selectedOptions{
                              name
                              value
                            }
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
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
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
              description
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
                    title
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