import React from 'react'
import { getProducts } from "../../utils/shopify";
import ProductCard from "@/components/ProductCard";

const Product = ({data}) => {
  const products = data.products.nodes;
  return (
    <div className='mt-20'>
        <h2 className="text-xl md:text-2xl text-center mt-24 md:mt-32 mb-0">Our Products</h2>
        <div className="productsList px-4 md:px-12 py-8 md:py-12">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
    </div>
  )
}

export const getServerSideProps = async () => {
    const data = await getProducts(50);
    return {
      props: { data }, 
    };
};

export default Product