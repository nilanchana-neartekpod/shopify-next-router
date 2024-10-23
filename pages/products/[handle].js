import ProductDetails from "../../components/ProductDetails";
import { getProduct } from "../../utils/shopify";
import Head from "next/head";

export default function Product({ product }) {
  const products = product;
  console.log(products, "pro");
  return (
    <>
      <Head>
        <title>Nextjs Shopify | {products.title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProductDetails product={products} />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const product = await getProduct("gid://shopify/Product/" + context.query.id);
  return {
    props: {
      product,
    },
  };
};
