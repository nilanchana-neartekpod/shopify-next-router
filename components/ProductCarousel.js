import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from 'next/image'
import Link from 'next/link'

const ProductCarousel = () => {
  const [isClient, setIsClient] = useState(false);
  const [slide, setSlide] = useState(0);
  

  const data = [
    { 
      id:0,
      "img": "/SlideImg1.png",
      "heading": "Shoes",
      "sub_heading": "Mens Shoes",
      "cta_link": "/collections/shoes"
    },
    {
      id:1,
      "img": "/SlideImg2.png",
      "heading": "Electronics",
      "sub_heading": "Smart Phones",
      "cta_link": "/collections/electronics"
    },
    {
      id:2,
      "img": "/SlideImg3.png",
      "heading": "Clothes",
      "sub_heading": "Womens Clothes",
      "cta_link": "/collections/clothes"
    },
    {
      id:3,
      "img": "/SlideImg1.png",
      "heading": "Shoes",
      "sub_heading": "Mens Shoes",
      "cta_link": "/collections/shoes"
    }
  ];

  const [slideData, setSlideData] = useState(data[0]);

  useEffect(() => {
    setSlideData(data[slide]);
  }, [slide])

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
        <p className="text-gray-600 text-black mb-4">
          Our designer already made a lot of beautiful prototypes of rooms that inspire you.
        </p>
        <Link href={"/products"} className="px-6 py-2 bg-[#B88E2F] text-white">
          Explore More
        </Link>
      </div>

      <div className="middle px-4 md:px-0">
        <Image
          src={slideData.img}
          fill={true}
          alt={slideData.heading}
        />

        <div className="content">
          <span className="sub_head">0{Number(slideData.id + 1)} <span>----</span> {slideData.heading} </span>
          <span className="head">{slideData.sub_heading}</span>
          <Link href={slideData.cta_link}>
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
          {
            data.map((el, i) => {
              return(
                <SwiperSlide key={i}>
                  <Image
                    src={el.img}
                    fill={true}
                    alt={el.heading}
                  />
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      </div>
    </div>
  );
};

export default ProductCarousel;
