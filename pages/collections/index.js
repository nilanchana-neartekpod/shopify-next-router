import React from 'react'
import { getCollections } from "../../utils/shopify";
import CollectionCard from "../../components/CollectionCard";
import Head from "next/head";

const Collections = ({collections}) => {
  const collectionList = collections.collections.nodes;
  return (
    <>
      <Head>
        <title>ShopSmarter | Our Collections</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='mt-20 px-4 md:px-12 py-8 md:py-12'>
        <h2 className='text-2xl md:text-3xl text-center mb-8 md:mb-12'>
            Our Collections
        </h2>
        <div className="collectionList">
            {collectionList.map((collection) => {
              return <CollectionCard key={collection.id} collection={collection} />;
            })}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async () => {
    const collections = await getCollections();
    return {
      props: { collections }, 
    };
  };

export default Collections