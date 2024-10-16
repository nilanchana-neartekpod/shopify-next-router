import Image from 'next/image'
import Link from 'next/link'

const ProductCard = ({product}) => {
  return (
    <>
        <div className='product'>
            <div>
                <Link href={`/products/${product.handle}/?id=${product.id.split('gid://shopify/Product/')[1]}`}>
                    
                    {product.featuredImage?.url ? (
                        <>
                            <Image src={product.featuredImage?.url} alt={product.title} fill={true} />
                        </>
                    ) : (
                        <>
                            <Image src="https://dummyimage.com/1200/09f/fff.png" alt={product.title} fill={true} />
                        </>
                    )}
                </Link>
            </div>
            <div>
                <Link href={`/products/${product.handle}/?id=${product.id.split('gid://shopify/Product/')[1]}`}>
                    <h5>{product.title}</h5>
                </Link>
                <div>{product.priceRange.minVariantPrice.amount} ₹</div>
                <div className='flex items-center justify-center'>
                    {Array.from({ length: Number(product.rating?.value) }, (_, i) => 
                        <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                        </svg>
                    )}
                </div>
            </div> 
        </div>
    </>
  )
}

export default ProductCard