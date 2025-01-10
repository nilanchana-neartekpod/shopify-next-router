import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from 'next/image'
import Link from 'next/link'

const ProductCarousel = ({data}) => {
  const [isClient, setIsClient] = useState(false);
  const [slide, setSlide] = useState(0);

  if(data.length == 0) return (<></>);
  
  const [slideData, setSlideData] = useState(data[0]);

  useEffect(() => {
    if (data.length > 0) {
      setSlideData(data[slide]);
    }
  }, [slide, data]);

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted
  }, []);

  if (!isClient) {
    return null; // Prevent Swiper from rendering on the server
  }

  return (
    <div className="customSwiperSliderContainer py-8 md:py-12">
      <div className="left pl-4 md:pl-12 pr-4 md:pr-0">
        <h2 className="font-bold mb-2">50+ Beautiful Rooms Inspiration</h2>
        <p className="text-gray-600 mb-4">
          Our designer already made a lot of beautiful prototypes of rooms that inspire you.
        </p>
        <Link href={"/products"} className="px-6 py-2 bg-[#B88E2F] text-white">
          Explore More
        </Link>
      </div>

      <div className="middle px-4 md:px-0">
        {slideData?.fields?.find(field => field.key === 'slider_img')?.reference?.image?.url && (
          <Image
            src={slideData.fields.find(field => field.key === 'slider_img').reference.image.url}
            fill={true}
            alt={slideData.fields.find(field => field.key === 'slider_title')?.value}
          />
        )}

        <div className="content">
          <span className="sub_head">
            {slideData?.fields?.find(field => field.key === 'slider_tag')?.value}
          </span>
          <span className="head">
            {slideData?.fields?.find(field => field.key === 'slider_title')?.value}
          </span>
          <Link href={`/collections/${slideData?.handle}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12H3M21 12L15 6M21 12L15 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className="right pl-4 md:pl-0">
        <Swiper
          slidesPerView={1.2}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          onSlideChange={(el) => setSlide(Number(el.realIndex))}
        >
          {data.length > 0 ? (
            data.map((el, i) => {
              const imgUrl = el?.fields?.find(field => field.key === 'slider_img')?.reference?.image?.url;
              return (
                <SwiperSlide key={i}>
                  <Image
                    src={imgUrl || '/default-image.jpg'} // Fallback to a default image if imgUrl is missing
                    fill={true}
                    alt={el?.handle || 'Slide Image'}
                  />
                </SwiperSlide>
              );
            })
          ) : (
            <div>Loading...</div> // Fallback UI when data is still being fetched
          )}

        </Swiper>
      </div>
    </div>
  );
};

export default ProductCarousel;
