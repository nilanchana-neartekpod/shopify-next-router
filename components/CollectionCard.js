import React from 'react';
import Image from 'next/image'
import Link from 'next/link';

const CollectionCard = ({collection}) => {
  return (
    <div className='collection'>
      <Link href={`/collections/${collection.handle}`}>
        {collection.image?.url ? (
            <>
                <Image src={collection.image?.url} alt={collection.title} fill={true} />
            </>
        ) : (
            <>
                <Image src="https://dummyimage.com/1200/09f/fff.png" alt={collection.title} fill={true} />
            </>
        )}
        <h2 className='text-center pt-4'>{collection.title}</h2>
      </Link>
    </div>
  )
}

export default CollectionCard