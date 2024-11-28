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
import ProductCard from "../components/ProductCard";
import CollectionCard from "../components/CollectionCard";
import Banner from "../components/home/Banner";
import ProductCarousel from "../components/ProductCarousel";
import Image from 'next/image';


export const getServerSideProps = async () => {
  const data = await getProducts(8);
  const collections = await getCollections();
  return {
    props: { data, collections },
  };
};

export default function Home({ data, collections }) {
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
      <main className="mt-12 md:mt-16 pt-1.5">
        <Banner />
        <div className="home-collections px-4 md:px-12 text-center">
          <h2 className="text-xl md:text-2xl mb-2">Browse The Range</h2>

          <div className="collectionList">
            {collectionList.map((collection) => {
              return (
                <CollectionCard key={collection.id} collection={collection} />
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl text-center mt-8 md:mt-12 mb-0">
            Our Products
          </h2>
          <div className="productsList px-4 md:px-12 py-8 md:py-12">
            {products.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>
        </div>

        <ProductCarousel />
        {/* Video Section with Loop */}
        <div className="video-section mt-8">
          <div className="video-wrapper">
            <video
              src="/video.mp4" // Ensure this is the correct path to your video
              width="100%"
              height="100%"
              autoPlay
              loop
              muted // Optional: if you want the video to play without sound
              playsInline // Optional: for better performance on mobile
              title="Product Video"
            ></video>
            <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center px-4 mt-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">WINTER-READY ESSENTIALS</h1>
            <p className="text-lg md:text-2xl">The durable, affordable, never-want-to-take-offable layers to last the whole season and beyond.</p>
          </div>
        </div>
          </div>
        </div>
        <div className="px-4 md:px-12 py-8 md:py-12">
          <img
            className="object-cover:fit overflow-hidden w-full"
            src="/collage.svg"
          ></img>
        </div>
        <div className="flex flex-wrap space-x-4 mt-2 items-stretch md:px-12 justify-between">
          {/* Shipping Information Card */}
          <div className="flex items-center p-4 border rounded-lg shadow-md flex-1 h-16 mt-5 sm:w-1/2 lg:w-1/4 bg-slate-200">
            <div className="mr-2 ">
              <Image
                src="https://razziwp.com/fashion/wp-content/uploads/sites/2/2022/12/truck3.svg"
                alt="FREE SHIPPING"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Free Shipping</h3>
              <p className="text-sm text-gray-600">From all orders over India</p>
            </div>
          </div>
 
          {/* Free Returns Card */}
          <div className="flex items-center p-4 border rounded-lg shadow-md flex-1 h-16 mt-5 sm:w-1/2 lg:w-1/4 bg-slate-200">
            <div className="mr-4">
              <Image
                src="https://razziwp.com/fashion/wp-content/uploads/sites/2/2022/12/money.svg"
                alt="Free Returns"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Free Returns</h3>
              <p className="text-sm text-gray-600">Return money within 30 days</p>
            </div>
          </div>
 
          {/* Secure Shopping Card */}
          <div className="flex items-center p-4 border rounded-lg shadow-md flex-1 h-16 mt-5 sm:w-1/2 lg:w-1/4 bg-slate-200">
            <div className="mr-4">
              <Image
                src="https://razziwp.com/fashion/wp-content/uploads/sites/2/2022/12/box.svg"
                alt="Secure Shopping"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Secure Shopping</h3>
              <p className="text-sm text-gray-600">You're in safe hands</p>
            </div>
          </div>
 
          {/* Icon Section */}
          <div className="flex items-center p-4 border rounded-lg shadow-md flex-1 h-16 mt-5 sm:w-1/2 lg:w-1/4 bg-slate-200">
            <div className="mr-4">
              <img
                src="https://razziwp.com/fashion/wp-content/uploads/sites/2/2022/12/like.svg"
                alt="Over 500 Styles"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Over 500 Styles</h3>
              <p className="text-sm text-gray-600">We have everything you need</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
