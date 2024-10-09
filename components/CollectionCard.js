import React from 'react';
import Image from 'next/image'

const CollectionCard = ({collection}) => {
  return (
    <div className='collection'>
        {collection.title}
        {collection.image?.url ? (
            <>
                <Image src={collection.image?.url} alt={collection.title} fill={true} />
            </>
        ) : (
            <>
                <Image src="https://dummyimage.com/1200/09f/fff.png" alt={collection.title} fill={true} />
            </>
        )}
    </div>
  )
}

export default CollectionCard