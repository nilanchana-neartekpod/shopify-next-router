import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProductCarousel = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted
  }, []);

  if (!isClient) {
    return null; // Prevent Swiper from rendering on the server
  }

  return (
    <div className="flex flex-col space-y-8">
      {/* First Row (Static Section) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">50+ Beautiful Rooms Inspiration</h2>
        <p className="text-gray-600 text-base">
          Our designer already made a lot of beautiful prototypes of rooms that inspire you.
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Explore More
        </button>
      </div>

      {/* Second Row (Single Swiper Carousel Section) */}
      <div className="flex flex-col items-center">
        <Swiper
          slidesPerView={2}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="w-1/2"
        >
          
          <SwiperSlide>
            <div className="h-3/4  bg-gray-100 rounded-lg shadow-md flex justify-center items-center">
              <p className="p-4">Room 1</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="h-3/4  bg-gray-100 rounded-lg shadow-md flex justify-center items-center">
              <p className="p-4">Room 2</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="h-3/4  bg-gray-100 rounded-lg shadow-md flex justify-center items-center">
              <p className="p-4">Room 3</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ProductCarousel;
