import React, { useEffect, useState } from 'react';
import Head from "next/head";
import { getProducts } from "../../utils/shopify";
import ProductCard from "@/components/ProductCard";
import ReactPaginate from "react-paginate";
import { GrNext, GrPrevious } from "react-icons/gr";

const Product = ({products}) => {
  const [currentImages, setCurrentImages] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [imagesOffset, setImagesOffset] = useState(0);
  const [pd, setPd] = useState(products);
  const [filter, setFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8); // default to 16 items per page

  const filterChangeValue = (el) => {
    setFilter(el.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setImagesOffset(0); // Reset to the first page when items per page change
  };

  useEffect(() => {
    let endOffset = imagesOffset + itemsPerPage;
    setCurrentImages(pd.slice(imagesOffset, endOffset));
    setPageCount(Math.ceil(pd.length / itemsPerPage));
  }, [pd, imagesOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % pd.length;
    setImagesOffset(newOffset);
  };

  useEffect(() => {
    if(filter === 'rating'){
      setPd(pd.sort((a, b) => { return Number(b.rating.value) - Number(a.rating.value); }));
    } else if(filter === 'price-low-high'){
      setPd(pd.sort((a, b) => { return Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount); }));
    } else if(filter === 'price-high-low'){
      setPd(pd.sort((a, b) => { return Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount); }));
    } else if(filter === 'alpha-a-z'){
      setPd(pd.sort((a, b) => a.title.localeCompare(b.title)));
    } else if(filter === 'alpha-z-a'){
      setPd(pd.sort((a, b) => b.title.localeCompare(a.title)));
    }

    let endOffset = imagesOffset + itemsPerPage;
    setCurrentImages(pd.slice(imagesOffset, endOffset));
    setPageCount(Math.ceil(pd.length / itemsPerPage));
  }, [pd, filter, imagesOffset, itemsPerPage]);

  if(!currentImages) return;

  return (
    <>
      <Head>
        <title>Nextjs Shopify | Our Products</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='mt-20'>
        <h2 className="text-xl md:text-2xl text-center mt-24 md:mt-32 mb-0">Our Products</h2>
        <div className='px-4 md:px-12 pt-8 md:pt-12 flex gap-4 justify-end items-center flex-col md:flex-row'>
          <div className="flex gap-2 flex-wrap items-center justify-stretch w-full md:w-auto">
            <label>Sort By: </label>
            <div className="relative flex-1">
              <select onChange={(el) => filterChangeValue(el)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                <option defaultValue>Select Option</option>
                <option value={"rating"}>Rating</option>
                <option value={"price-low-high"}>Price, Low-to-High</option>
                <option value={"price-high-low"}>Price, High-to-Low</option>
                <option value={"alpha-a-z"}>Alphabetically, A-Z</option>
                <option value={"alpha-z-a"}>Alphabetically, Z-A</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2 right-2.5 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center justify-stretch w-full md:w-auto">
            <label>Items per page: </label>
            <div className="relative flex-1">
              <select onChange={(e) => handleItemsPerPageChange(e)} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                <option defaultValue>Select Option</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={20}>20</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2 right-2.5 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </div>
          </div>
        </div>

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
    </>
  )
}

export const getServerSideProps = async () => {
  const data = await getProducts(50);
  if(data.products.nodes.length === 0) return { props: {products: []}};
  return { props: { products : data.products.nodes } };
};

export default Product;
