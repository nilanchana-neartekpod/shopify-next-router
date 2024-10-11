import Image from "next/image";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import Head from "next/head";
import { getProducts, getCollections } from "../utils/shopify";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";

export const getServerSideProps = async () => {
  const data = await getProducts(8);
  const collections = await getCollections();
  return {
    props: { data, collections }, 
  };
};

export default function Home({data, collections}) {
  const products = data.products.nodes;
  const collectionList = collections.collections.nodes;
  return (
    <>
      <Head>
        <title>Nextjs Shopify | Home Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-24">
        <div className="home-collections px-4 md:px-12 text-center">
          <h2 className="text-xl md:text-2xl mb-2">Browse The Range</h2>
          <p className="mb-8 md:mb-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="collectionList">
            {collectionList.map((collection) => {
              return <CollectionCard key={collection.id} collection={collection} />;
            })}
          </div>
        </div>

        <h2 className="text-xl md:text-2xl text-center mt-8 md:mt-12 mb-0">Our Products</h2>
        <div className="productsList px-4 md:px-12 py-8 md:py-12">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </main>
    </>
  );
}
