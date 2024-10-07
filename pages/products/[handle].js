import ProductDetails from "@/components/ProductDetails";
import { getProduct } from "../../utils/shopify";

export default function Product({ product }) {
    return <ProductDetails product={product} />;
}

export const getServerSideProps = async (context) => {
  const product =  await getProduct('gid://shopify/Product/'+ context.query.id);
  return {
    props: {
      product,
    },
  };
};