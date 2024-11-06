import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CollectionCard = ({ collection }) => {
  return (
    <div className="collection relative">
      <Link href={`/collections/${collection.handle}`}>
        {collection.image?.url ? (
          <Image
            src={collection.image?.url}
            alt={collection.title}
            fill={true}
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        ) : (
          <Image
            src="https://dummyimage.com/1200/09f/fff.png"
            alt={collection.title}
            fill={true}
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        )}
        
        <h2 className='text-center pt-4'>{collection.title}</h2>
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 text-center">
          <button className="mt-2 bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition">
            Shop Now →
          </button>
        </div>
      </Link>
    </div>
  );
};

export default CollectionCard;
