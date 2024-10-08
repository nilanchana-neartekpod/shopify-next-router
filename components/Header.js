import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const Header = () => {
  let [cartId, setCartId] = useState(null);

  useEffect(() =>{
    let _cartId = sessionStorage.getItem("cartId");
    if(_cartId) setCartId(_cartId);
  },[cartId]);
  
  return (
    <div>
      Header 
      <Link href={`/`}>Home</Link>
      {cartId ? (<>
        <Link href={`/cart?cartid=${cartId}`}>View Cart</Link>
      </>) : (<>
        <Link href={`/cart`}>View Cart</Link>
      </>) }
    </div>
  )
}

export default Header