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
  const [filter, setFilter] = useState("rating");
  const [itemsPerPage, setItemsPerPage] = useState(8); // default to 16 items per page
  const [starRating, setStarRating] = useState('');

  const filterChangeValue = (el) => {
    setFilter(el.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setImagesOffset(0); // Reset to the first page when items per page change
  };

  const starFilterClick = (star) => {
    setStarRating(star);
    let _pds = products;
    setPd(_pds.filter(function(el) {
      return el.rating.value === star;
    }));
    setCurrentImages(null);
    setFilter('rating');
    setPageCount(0);
    setImagesOffset(0);
    setItemsPerPage(8);
  }

  const clearAllFilters = () => {
    setPd(products);
    setCurrentImages(null);
    setFilter('rating');
    setPageCount(0);
    setImagesOffset(0);
    setItemsPerPage(8);
    setStarRating('');
  }

  useEffect(() => {
    let endOffset = imagesOffset + itemsPerPage;
    setCurrentImages(pd.slice(imagesOffset, endOffset));
    setPageCount(Math.ceil(pd.length / itemsPerPage));
    setStarRating(starRating);
  }, [pd, imagesOffset, itemsPerPage, starRating]);

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
    setStarRating(starRating);
  }, [pd, filter, imagesOffset, itemsPerPage, starRating]);

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
        <div className='flex gap-4 md:gap-8 flex-col md:flex-row px-4 md:px-12 pt-8 md:pt-12'>
          <div className='filters hidden md:flex flex-col basis-full md:basis-1/12'>
            <h3 className='text-base md:text-xl'>Filter</h3>

            {(starRating != '') && (
              <>
                <p className='pt-8 md:pt-12'><span className='font-bold'>Selected Filter:</span> {starRating && (<>{starRating} - Ratings </>)}</p>
                {(starRating) &&  <p className='cursor-pointer px-2 py-1 inline-block bg-[#dc0707] uppercase font-bold text-white mt-4' onClick={() => clearAllFilters()}>ClearFilter</p>}
              </>
            )}

            <h5 className='pt-8 md:pt-12'>Ratings</h5>
            <div className='ratings pt-4 flex flex-col gap-4'>
              <div className='rating inline-flex gap-1 cursor-pointer' onClick={() => starFilterClick('5')}>
                {Array.from({ length: 5 }, (_, i) => 
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                  </svg>
                )}
              </div>
              <div className='rating inline-flex gap-1 cursor-pointer' onClick={() => starFilterClick('4')}>
                {Array.from({ length: 4 }, (_, i) => 
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                  </svg>
                )}
              </div>
              <div className='rating inline-flex gap-1 cursor-pointer' onClick={() => starFilterClick('3')}>
                {Array.from({ length: 3 }, (_, i) => 
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                  </svg>
                )}
              </div>
              <div className='rating inline-flex gap-1 cursor-pointer' onClick={() => starFilterClick('2')}>
                {Array.from({ length: 2 }, (_, i) => 
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                  </svg>
                )}
              </div>
              <div className='rating inline-flex gap-1 cursor-pointer' onClick={() => starFilterClick('1')}>
                {Array.from({ length: 1 }, (_, i) => 
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className='pageData basis-full md:basis-11/12'>
            <div className='flex gap-4 justify-end items-center flex-col md:flex-row'>
              <div className="flex gap-2 flex-wrap items-center justify-stretch w-full md:w-auto">
                <label>Sort By: </label>
                <div className="relative flex-1">
                  <select onChange={(el) => filterChangeValue(el)} value={filter} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
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
                  <select onChange={(e) => handleItemsPerPageChange(e)} value={itemsPerPage} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-1.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
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

            <div className="pagination py-8 md:py-12 plp-product-listing">
              <div className="productsList">
                {currentImages && currentImages.map((product) => {
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
        </div>
        
      </div>
    </>
  )
}

export const getServerSideProps = async () => {
  const data = await getProducts(250);
  if(data.products.nodes.length === 0) return { props: {products: []}};
  return { props: { products : data.products.nodes } };
};

export default Product;
