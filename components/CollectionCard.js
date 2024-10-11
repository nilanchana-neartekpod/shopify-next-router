import React from 'react';
import Image from 'next/image'

const CollectionCard = ({collection}) => {
  return (
    <div className='collection'>
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
    </div>
  )
}

export default CollectionCard