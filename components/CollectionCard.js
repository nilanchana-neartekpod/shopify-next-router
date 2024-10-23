import React from "react";
import Image from "next/image";
import Link from "next/link";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

const CollectionCard = ({ collection }) => {
  // console.log(collection, "collection");
  return (
    <div className="collection relative w-full h-80">
      <Link href={`/collections/${collection.handle}`}>
        {/* No <a> tag needed */}
        {collection.image?.url ? (
          // <Image
          //   src={collection.image?.url || ""}
          //   alt={collection.title || ""}
          //   fill={true}
          //   // objectFit="cover"
          // />
          <img src={collection.image.url} alt={collection.title || ""} />
        ) : (
          <img
            src="https://dummyimage.com/1200/09f/fff.png"
            alt={collection.title}
          />
          // <Image
          //   src="https://dummyimage.com/1200/09f/fff.png"
          //   alt={collection.title}
          //   fill={true}
          //   // objectFit="cover"
          // />
        )}
        <h2 className="text-center pt-4">{collection.title}</h2>
      </Link>
    </div>
  );
};

export default CollectionCard;
