import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CollectionCard = ({ collection }) => {
  return (
    <div className="collection relative group">
      <Link href={`/collections/${collection.handle}`}>
        <div className="relative">
          <div className="relative w-full h-80 rounded-xl overflow-hidden">
            <Image
              src={collection.image?.url || "https://dummyimage.com/1200/09f/fff.png"}
              alt={collection.title}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300 ease-in-out group-hover:opacity-90"
            />
          </div>

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col text-center text-white mt-10">
            <h2 className="text-2xl font-bold  ">{collection.title}</h2>
            <p className="mt-2 text-base">{collection.description}</p>
          </div>

          {/* Button appears only on hover */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="mt-2 bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition">
              Shop Now →
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CollectionCard;
