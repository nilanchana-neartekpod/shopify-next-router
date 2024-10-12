import React, { useEffect, useState } from 'react'
import { getProducts } from "../../utils/shopify";
import ProductCard from "@/components/ProductCard";
import ReactPaginate from "react-paginate";
import { GrNext, GrPrevious } from "react-icons/gr";

const Product = ({products}) => {
  const [currentImages, setCurrentImages] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [imagesOffset, setImagesOffset] = useState(0);

  useEffect(() => {
    const endOffset = imagesOffset + 8;
    setCurrentImages(products.slice(imagesOffset, endOffset));
    setPageCount(Math.ceil(products.length / 8));
  }, [products, imagesOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 8) % products.length;
    setImagesOffset(newOffset);
  };

  if(!currentImages) return;

  return (
    <div className='mt-20'>
        <h2 className="text-xl md:text-2xl text-center mt-24 md:mt-32 mb-0">Our Products</h2>
        <div className="pagination px-4 md:px-12 py-8 md:py-12 plp-product-listing">
          <div className="productsList">
            {currentImages.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel={<GrNext />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<GrPrevious />}
            renderOnZeroPageCount={null}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const data = await getProducts(50);
  if(data.products.nodes.length === 0) return { props: {products: []}};
  return { props: { products : data.products.nodes } };
};

export default Product