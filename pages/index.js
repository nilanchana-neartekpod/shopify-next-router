import Image from "next/image";
import localFont from "next/font/local";
import Head from "next/head";
import { getProducts, getCollections, getMetaobjectById } from "../utils/shopify";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import Banner from "@/components/home/Banner";
import ProductCarousel from "@/components/ProductCarousel";
import { isAuthenticated } from "../utils/auth"; // Import your auth utility

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

export const getServerSideProps = async (context) => {
  const { req, resolvedUrl } = context;
  console.log(req.cookies);
  
  // Set optionalAuth flag for pages where authentication is not required
  const optionalAuth = resolvedUrl === "/"; // No auth needed for home page
  
  // Check if user is authenticated
  const auth = await isAuthenticated(req);
  console.log('User authenticated:', auth);
  
  // Redirect to login if required and user is not authenticated
  if (!auth && !optionalAuth) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Fetch products and collections
  const data = await getProducts(8);
  const collections = await getCollections();

  const metaobject =  await getMetaobjectById('79607005434');
  
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
          <h2 className="text-2xl md:text-2xl mb-2">Browse The Range</h2>
          <p className="mb-8 md:mb-12">Discover a variety of top-quality products! <br/> Shop our selection of shoes, electronics, and clothing to find your perfect match.</p>
          <div className="collectionList">
            {collectionList.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>

            {/* Static image above "Our Products" */}
        {/* <section className="image-section relative px-4 md:px-12 mt-12">
        <div className="relative">
          <Image
            src="/static.avif" 
            alt="Featured"
            width={1200}
            height={400} 
            className="rounded-lg shadow-md"
          /> */}
          {/* Overlay content */}
          {/* <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white bg-black/50 rounded-lg">
            <h1 className="text-2xl md:text-2xl font-bold mb-2">We Make Better Things In A Better Way</h1>
            <p className="text-lg md:text-xl mb-4 text-center max-w-2xl">Explore a curated collection of top-quality clothes, shoes, and electronics designed to enhance your lifestyle with style and innovation.</p>
            <h2 className="text-xl md:text-2xl font-semibold">Shop Smarter</h2>
            <p className="text-md md:text-lg">By Nature</p>
          </div>
        </div>
      </section> */}

        </div>
        <div className="text-center mt-1 md:mt-16 mb-8">
        <h2 className="text-xl md:text-3xl mb-6">Our Products</h2>
        <p className="text-xl md:text-lg text-black">
          <span className="block">Discover the perfect mix of style and premium quality</span>
          <span className="block">with our versatile range of dresses for every budget and occasion.</span>
        </p>
      </div>
        <div className="productsList px-4 md:px-12 py-8 md:py-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <ProductCarousel />
        
        <div className="px-4 md:px-12 py-8 md:py-12">
          <img className="object-cover:fit overflow-hidden w-full" src="/collage.svg" alt="Collage" />
        </div>
        <div className="flex flex-wrap space-x-4 mt-2 items-stretch justify-between"> {/* Flex container to align cards side by side */}
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
