import React, { useEffect, useState } from 'react'

const Header = () => {
  let [cartId, setCartId] = useState(null);

  useEffect(() =>{
    let _cartId = sessionStorage.getItem("cartId");
    if(_cartId) setCartId(_cartId);
  },[cartId]);
  
  return (
    <div>
      Header 
      {cartId ? (<>
        <a href={`/cart?cartid=${cartId}`}>View Cart</a>
      </>) : (<>
        <a href="/cart">View Cart</a>
      </>) }
    </div>
  )
}

export default Header