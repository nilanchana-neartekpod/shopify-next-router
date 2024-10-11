import React from 'react'
import { getCollectionProducts } from "../../utils/shopify";
import ProductCard from "@/components/ProductCard";

export const getServerSideProps = async (context) => {
    const data = await getCollectionProducts(context.params.handle);
    return {
      props: { data }, 
    };
  };

const CollectionProducts = ({data}) => {
  const products = data.collectionByHandle.products.nodes;
  return (
    <div className='mt-20'>
        <h2 className="text-xl md:text-2xl text-center mt-24 md:mt-32 mb-0">{data.collectionByHandle.title}</h2>
        <div className="productsList px-4 md:px-12 py-8 md:py-12">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
    </div>
  )
}

export default CollectionProducts