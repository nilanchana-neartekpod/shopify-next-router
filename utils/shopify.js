// import { log } from "console";
import { gql, GraphQLClient,request } from "graphql-request";
const token = process.env.TOKEN;
const endpoint = process.env.SHOPURL;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: { "X-Shopify-Storefront-Access-Token": token, "Content-Type": "application/json" }
});
const graphQLBackend = new GraphQLClient(process.env.ADMIN_API_END_POINT, {
  headers: { 'X-Shopify-Access-Token': process.env.ADMIN_ACCESS_TOKEN, "Content-Type": "application/json" }
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
export async function createMetaobject(fields) {
 const mutation = gql`mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject {
        fields {
          value
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }`;

  try {
    const variables = {
      "metaobject": {
        "type": "review",
        "fields": fields,
        "capabilities": { publishable : {status: "DRAFT" } }
      }
    };
    const data = await graphQLBackend.request(mutation, variables);
    
    if(data.metaobjectCreate.userErrors.length > 0) {
      throw new Error(
        `Error creating metaobject: ${data.metaobjectCreate.userErrors[0].message}`
      );
    }

    // Return the created customer data
    return  data.metaobjectCreate.metaobject.fields;
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
    console.log("backend", data);
    

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
export async function getMetaobjectByType() {
  const query = gql`{
    metaobjects(type: "Slider_card",first:10) {
       nodes{
        id
        handle
        fields {
          key
          value
          reference{
            ... on MediaImage{
              id
              image{
                url
              }
            }
          }
          }
        }
      }
    }
  `;

  try {
    const data = await graphQLClient.request(query);
    //console.log("Raw Backend Data:",  JSON.stringify(data, null, 2)); // Log the raw data
    return data;
  } catch (error) {
    console.error("Error fetching metaobjects:", error.message);
    throw new Error(error.message || "Error retrieving metaobjects");
  }
}
export async function getReviews(productId) {
  const query = gql`
    query MyQuery {
      metaobjects(type: "review", first: 250, query: "display_name:${productId}") {
        nodes {
          product_id: field(key: "pid") {
            value
          }
          product_title: field(key: "title") {
            value
          }
          product_body: field(key: "body") {
            value
          }
          product_rating: field(key: "rating") {
            value
          }
          customer_name:field(key: "customer_name") {
            value
          }
          email: field(key: "email") {
            value
          }
          updatedAt
        }
      }
    }
  `;

  try {
    const data = await graphQLBackend.request(query);
    // console.log("values",data?.metaobjects?.nodes );
    
    return data?.metaobjects?.nodes || [];
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw new Error(error.message || "Error retrieving reviews");
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
                    selectedOrFirstAvailableVariant {
                      id
                      availableForSale
                    }
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
export async function updateMetafield(customerId, metafieldId, wishlistValue) {
  const updateMetafieldMutation = gql`
   mutation updateCustomerMetafields($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          metafields(first: 3) {
            edges {
              node {
                id
                namespace
                key
                value
              }
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }
 
  `;
  const input = {
    id: customerId,
    metafields: [
      {
        id: metafieldId,
        value: wishlistValue,
      },
    ],
  };

  const variables = { input };

  try {
    const data = await graphQLBackend.request(updateMetafieldMutation, variables);
    // console.log("GraphQL Update Customer Metafields Response:", data); // Log response for debugging  
    return [];

  } catch (error) {
    console.error("Error update metafield:", error.message);
    throw new Error(error.data?.errors[0]?.message || error.message || "Failed to update  metafield");
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
        wishlist: metafield(key: "wishlist", namespace: "custom") {
          value
          id
          description
          type
        }
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
    // console.log("metafield",data.customer.metafield);
    return data;  
  } catch (error) {
    throw new Error(error.message || 'Error fetching customer addresses');
  }
}
export async function createCustomerAddress(customerAccessToken, addressInput) {
  const mutation = gql`
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
          name
          address1
          address2
          city
          province
          country
          zip
          firstName
          lastName
          phone
        }
        customerUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    customerAccessToken,
    address: addressInput,
  };
  
  try {
    const data = await graphQLClient.request(mutation, variables);
    // console.log("GraphQL Create Address Response:", data); // Log the response for debugging

    if (data.customerAddressCreate.customerUserErrors.length > 0) {
      console.error(
        "GraphQL Create Address Errors:",
        data.customerAddressCreate.customerUserErrors
      );
      throw new Error(data.customerAddressCreate.customerUserErrors[0].message);
    }

    return data.customerAddressCreate.customerAddress;
  } catch (error) {
    console.error("Error creating customer address:", error.message);
    throw new Error(error.message || "Failed to create customer address");
  }
}
export async function deleteCustomerAddress(accessToken, addressId) {
  const mutation = gql`
    mutation deleteCustomerAddress($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    customerAccessToken: accessToken,
    id: addressId,
  };
  // console.log('GraphQL Variables:', variables);
  try {
    const data = await graphQLClient.request(mutation, variables);

    // Check for user errors
    if (data.customerAddressDelete.customerUserErrors.length > 0) {
      console.error('GraphQL User Errors:', data.customerAddressDelete.customerUserErrors);
      throw new Error(
        `Error deleting customer address: ${data.customerAddressDelete.customerUserErrors[0].message}`
      );
    }

    // Return the ID of the deleted address
    return data.customerAddressDelete.deletedCustomerAddressId;
  } catch (error) {
    throw new Error(error.message || "Error deleting customer address");
  }
}

export async function updateCustomerAddress(customerAccessToken, addressId, addressInput) {
  const updateAddressMutation = gql`
    mutation customerAddressUpdate(
      $address: MailingAddressInput!,
      $customerAccessToken: String!,
      $id: ID!
    ) {
      customerAddressUpdate(
        address: $address,
        customerAccessToken: $customerAccessToken,
        id: $id
      ) {
        customerAddress {
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          province
          zip
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
    address: addressInput,
    customerAccessToken,
    id: addressId,
  };

  try {
    const data = await graphQLClient.request(updateAddressMutation, variables);
    // console.log("GraphQL response:", data);  // Add logging to capture the response

    if (data.customerAddressUpdate.customerUserErrors.length > 0) {
      console.log("User errors:", data.customerAddressUpdate.customerUserErrors);  // Log the errors
      throw new Error(
        `Error updating address: ${data.customerAddressUpdate.customerUserErrors[0].message}`
      );
    }

    return data.customerAddressUpdate.customerAddress;
  } catch (error) {
    console.error("Error during address update:", error.message);  // Log the full error
    throw new Error(error.message);
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
                availableForSale
                selectedOrFirstAvailableVariant {
                  id
                }
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
                options(first: 100) {
                  name
                  optionValues {
                    name
                  }
                }
                sellingPlanGroups(first: 10) {
                  nodes {
                    name
                    sellingPlans(first: 10) {
                      nodes {
                        id
                        name
                        options {
                          name
                          value
                        }
                        priceAdjustments {
                          adjustmentValue {
                            ... on SellingPlanFixedAmountPriceAdjustment {
                              adjustmentAmount {
                                amount
                              }
                            }
                            ... on SellingPlanPercentagePriceAdjustment {
                              adjustmentPercentage
                            }
                          }
                        }
                      }
                    }
                  }
                }
                variants(first: 100) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      quantityAvailable
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                      sellingPlanAllocations(first: 10) {
                        nodes {
                          sellingPlan {
                            name
                            options {
                              name
                              value
                            }
                            id
                            priceAdjustments {
                              adjustmentValue {
                                ... on SellingPlanFixedAmountPriceAdjustment {
                                  adjustmentAmount {
                                    amount
                                  }
                                }
                                ... on SellingPlanPercentagePriceAdjustment {
                                  adjustmentPercentage
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                rating: metafield(key: "rating", namespace: "custom") {
                  value
                }
                option: metafield(key: "options", namespace: "custom") {
                  value
                  updatedAt
                  type
                  namespace
                  id
                  key
                  references(first: 10) {
                    nodes {
                      ... on Metaobject {
                        id
                        fields {
                          key
                          value
                        }
                      }
                    }
                  }
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

export const addToCart = async (itemId, quantity, sellingPlanId, attributes) => {
    const createCartMutation = gql`mutation createCart($cartInput: CartInput){ cartCreate(input: $cartInput){ cart{ id } } }`;
    let variables = null;

    if(sellingPlanId){
      variables = { cartInput: { lines: [ { quantity: parseInt(quantity), merchandiseId: itemId, attributes, sellingPlanId } ] } }
    }else{
      variables = { cartInput: { lines: [ { quantity: parseInt(quantity), merchandiseId: itemId, attributes } ] } }
    }
    
    // console.log("addToCart Variables:", variables);

    try {
      let response = await graphQLClient.request(createCartMutation, variables);
      // console.log("addToCart Variables:", variables);
      // console.log("rsp",response);
      return response;
    } catch (error) {
      throw new Error(error);
    }
}

export async function updateCart(cartId, itemId, quantity, sellingPlanId , attributes) {
    const updateCartMutation = gql`mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id } } }`;
    let variables = null;

    if(sellingPlanId){
      variables = {
        cartId: cartId,
        lines: [
          {
            quantity: parseInt(quantity),
            merchandiseId: itemId,
            sellingPlanId,
             attributes
          },
        ],
      };
    }else{
      variables = {
        cartId: cartId,
        lines: [
          {
            quantity: parseInt(quantity),
            merchandiseId: itemId,
            attributes
          },
        ],
      };
    }

    try {
      const data = await graphQLClient.request(updateCartMutation, variables);
      // console.log("updated Cart:", JSON.stringify(data, null, 2));
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
                attributes {
                    key
                    value
                  }
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
      // console.log("Retrieved Cart:", JSON.stringify(data, null, 2));
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


export async function customerForgotPassword(email) {
  const forgotPasswordMutation = gql`
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          message
        }
          userErrors {field message}
      }
    }
  `;
  const variables = { email };
  try {
    const data = await graphQLClient.request(forgotPasswordMutation, variables);
    if(data.customerRecover.customerUserErrors.length>0){
      throw new Error(`Error while resetting password: ${data.customerRecover.customerUserErrors[0].message}`)
    }
    return {
  message:"password reset email sent sucessfully"};
  } catch (error) {
    throw new Error(error.message ||"Error while reseting password");
  }
}

export async function createCustomerSub(email) {
  const mutation = gql`
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          email
        }
        userErrors{
          field
          message
        }
      }
    }
  `;

  try {
    const variables = {"input": { "email": email ,emailMarketingConsent: { marketingState: "SUBSCRIBED", marketingOptInLevel: "CONFIRMED_OPT_IN"} } };
    
    const data = await graphQLBackend.request(mutation,variables);

    if(data.customerCreate.userErrors.length > 0) throw new Error(data.customerCreate.userErrors[0].message);

    return {
      success: true,
      customer: data.customerCreate.customer,
    };
  } catch (error) {
    console.error("Error creating customer:", error.message);
    return {
      success: false,
      message: error.message || "Error creating customer",
    };
  }
}