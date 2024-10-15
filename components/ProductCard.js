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
            </div> 
        </div>
    </>
  )
}

export default ProductCard