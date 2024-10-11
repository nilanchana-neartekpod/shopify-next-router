import React from 'react'
import { getProducts } from "../../utils/shopify";

const Product = ({data}) => {
  return (
    <div className='mt-24'>Product</div>
  )
}

export const getServerSideProps = async () => {
    const data = await getProducts(50);
    return {
      props: { data }, 
    };
  };

export default Product