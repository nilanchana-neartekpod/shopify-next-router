import React from 'react'
import { getCollectionProducts } from "../../utils/shopify";
import ProductCard from "../../components/ProductCard";
import Head from "next/head";

export const getServerSideProps = async (context) => {
    const data = await getCollectionProducts(context.params.handle);
    return {
      props: { data }, 
    };
  };

const CollectionProducts = ({data}) => {
  const products = data.collectionByHandle.products.nodes;
  return (
    <>
      <Head>
        <title>ShopSmarter | {data.collectionByHandle.title} Collection</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='mt-20'>
        <h2 className="text-xl md:text-2xl text-center mt-24 md:mt-32 mb-0">{data.collectionByHandle.title}</h2>
        <div className="productsList px-4 md:px-12 py-8 md:py-12">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </>
  )
}

export default CollectionProducts