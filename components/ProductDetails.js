import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { addToCart, updateCart } from "../utils/shopify";
import ProductCard from "../components/ProductCard"; // Adjust the path as needed
import ImageGallery from "react-image-gallery";
import useGlobalStore from '../store/store'

const ProductDetails = ({product}) => {
    const [quantity, setQuantity] = useState(0);
    const [checkout, setCheckout] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0].node.id);
    const [availableForSale, setAvailableForSale] = useState(product.variants.edges[0].node.availableForSale);
    const prodVariantRef = useRef(null);
    const [selectedOffer, setSelectedOffer] = useState(null); // Add this line to manage the selected offer
    const [varPrice, setVarPrice] = useState(product.variants?.edges[0]?.node?.price);
    const [varCompPrice, setVarCompPrice] = useState(product.variants?.edges[0]?.node?.compareAtPrice);

    const handleSellingPlanChange = (plan) => {
        setSelectedOffer(plan); // Set the selected offer (or selling plan);

        if(product.options.length === 1 && product.options[0]?.name === 'Title'){
            if(product.options[0]?.optionValues[0]?.name === 'Default Title'){
                let amt = product.variants?.edges[0]?.node?.price?.amount;
                let compAmt = product.variants?.edges[0]?.node?.compareAtPrice?.amount;
                if(!plan){
                    setVarPrice({ amount: amt});
                    setVarCompPrice({amount: compAmt});
                }else{
                    
                    if(plan.priceAdjustments){
                        if(plan.priceAdjustments[0]?.adjustmentValue){
                            if(plan.priceAdjustments[0]?.adjustmentValue?.adjustmentAmount){
                                let amtDiscount = plan.priceAdjustments[0]?.adjustmentValue?.adjustmentAmount?.amount;
                                if(amt){
                                    if(amtDiscount){
                                        setVarPrice({amount: Number(amt) - Number(amtDiscount)});
                                    }
                                }
                                if(compAmt){
                                    if(amtDiscount){
                                        setVarCompPrice({amount: Number(compAmt) - Number(amtDiscount)});
                                    }
                                }
                            }
                            if(plan.priceAdjustments[0]?.adjustmentValue?.adjustmentPercentage){
                                let prtgDiscount = plan.priceAdjustments[0]?.adjustmentValue?.adjustmentPercentage;
                                if(amt){
                                    if(prtgDiscount){
                                        let discountAmt = (( prtgDiscount / 100 ) * amt );
                                        setVarPrice({amount: Number(amt) - Number(discountAmt)});
                                    }
                                }
                                if(compAmt){
                                    if(prtgDiscount){
                                        let discountAmt = (( prtgDiscount / 100 ) * compAmt );
                                        setVarCompPrice({amount: Number(compAmt) - Number(discountAmt)});
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }

    };

    const [opt1, setOpt1] = useState(null);
    const [opt2, setOpt2] = useState(null);
    const [opt3, setOpt3] = useState(null);

    const handleVariant = (_type, _val, _optIn) => {
        if(_optIn == 0){
            setOpt1(_val);
        }else if(_optIn == 1){
            setOpt2(_val);
        }else if(_optIn == 2){
            setOpt3(_val);
        }
    }

    const getPrices = useCallback((variant) => {
       
        let amt = variant?.price?.amount;
        let compAmt = variant?.compareAtPrice?.amount;
        
        if(selectedOffer){
            if(selectedOffer.priceAdjustments){
                if(selectedOffer.priceAdjustments[0]?.adjustmentValue){
                    if(selectedOffer.priceAdjustments[0]?.adjustmentValue?.adjustmentAmount){
                        let amtDiscount = selectedOffer.priceAdjustments[0]?.adjustmentValue?.adjustmentAmount?.amount;
                        if(amt){
                            if(amtDiscount){
                                setVarPrice({amount: Number(amt) - Number(amtDiscount)});
                            }
                        }
                        if(compAmt){
                            if(amtDiscount){
                                setVarCompPrice({amount: Number(compAmt) - Number(amtDiscount)});
                            }
                        }
                    }
                    if(selectedOffer.priceAdjustments[0]?.adjustmentValue?.adjustmentPercentage){
                        let prtgDiscount = selectedOffer.priceAdjustments[0]?.adjustmentValue?.adjustmentPercentage;
                        if(amt){
                            if(prtgDiscount){
                                let discountAmt = (( prtgDiscount / 100 ) * amt );
                                setVarPrice({amount: Number(amt) - Number(discountAmt)});
                            }
                        }
                        if(compAmt){
                            if(prtgDiscount){
                                let discountAmt = (( prtgDiscount / 100 ) * compAmt );
                                setVarCompPrice({amount: Number(compAmt) - Number(discountAmt)});
                            }
                        }
                    }
                }
            }
        }else{
            setVarPrice({amount: variant?.price?.amount});
            setVarCompPrice({amount: variant?.compareAtPrice?.amount});
        }
    }, [selectedOffer, selectedVariant]);

    useEffect(() => {
        let opt1_len = prodVariantRef.current?.querySelectorAll("[name='variantOption0']");
        let opt2_len = prodVariantRef.current?.querySelectorAll("[name='variantOption1']");
        let opt3_len = prodVariantRef.current?.querySelectorAll("[name='variantOption2']");

        if(opt1_len.length > 0){
            let {node} = product.variants.edges[0];
            let _op1 = opt1_len[0].getAttribute('data-opname');
            let opVal = node.selectedOptions.find(o => o.name == _op1);
            setOpt1(opVal.value);
            if(opVal){
                let _el = prodVariantRef.current?.querySelector(`[name='variantOption0'][value='${opVal.value}']`); 
                if(_el) _el.checked = true;
            }
        }
        if(opt2_len.length > 0){
            let {node} = product.variants.edges[0];
            let _op1 = opt2_len[0].getAttribute('data-opname');
            let opVal = node.selectedOptions.find(o => o.name == _op1);
            setOpt2(opVal.value);
            if(opVal){
                let _el = prodVariantRef.current?.querySelector(`[name='variantOption1'][value='${opVal.value}']`); 
                if(_el) _el.checked = true;
            }
        }
        if(opt3_len.length > 0){
            let {node} = product.variants.edges[0];
            let _op1 = opt3_len[0].getAttribute('data-opname');
            let opVal = node.selectedOptions.find(o => o.name == _op1);
            setOpt3(opVal.value);
            if(opVal){
                let _el = prodVariantRef.current?.querySelector(`[name='variantOption2'][value='${opVal.value}']`); 
                if(_el) _el.checked = true;
            }
        }
    },[]);

    useEffect(() => {
        if(opt1 && opt2 && opt3){
            let variant = product.variants.edges.find(variant => variant.node.selectedOptions.some(option => option.value == opt1) && variant.node.selectedOptions.some(option => option.value == opt2) && variant.node.selectedOptions.some(option => option.value == opt3));
            if(variant && variant.node.quantityAvailable > 0 && variant.node.availableForSale){
                setAvailableForSale(true);
            }else{
                setAvailableForSale(false);
            }
            if(variant) { setSelectedVariant(variant.node.id); getPrices(variant?.node); }
        }else if(opt1 && opt2 && !opt3){
            let variant = product.variants.edges.find(variant => variant.node.selectedOptions.some(option => option.value == opt1) && variant.node.selectedOptions.some(option => option.value == opt2));
            if(variant && variant.node.quantityAvailable > 0 && variant.node.availableForSale){
                setAvailableForSale(true);
            }else{
                setAvailableForSale(false);
            }
            if(variant){ setSelectedVariant(variant.node.id); getPrices(variant?.node); }
        }else if(opt1 && !opt2 && !opt3){
            let variant = product.variants.edges.find(variant => variant.node.selectedOptions.some(option => option.value == opt1));
            if(variant && variant.node.quantityAvailable > 0 && variant.node.availableForSale){
                setAvailableForSale(true);
            }else{
                setAvailableForSale(false);
            }
            if(variant) { setSelectedVariant(variant.node.id); getPrices(variant?.node); }
        }
    },[availableForSale, selectedVariant, opt1, opt2, opt3, getPrices]);

    const cartTotal = useGlobalStore((state) => state.cartTotal);

    let imagesArray =  [];
    for(let item of product.images.nodes){
        imagesArray.push({
            original: item.url,
            thumbnail: item.url,
            srcSet: item.url,
            originalAlt: product.title,
            thumbnailAlt: product.title,
            loading:"lazy",
            thumbnailLoading: "lazy"
        });
    }

    const updateQuantity = (e) => {
        if (e && e.target) {
            setQuantity(Number(e.target.value)); // Convert to number
            if (Number(e.target.value) === 0) setCheckout(false); // Update checkout status based on quantity
        }
    };

    const changeVariantValue = (e) =>{
        setSelectedVariant(e);
        for(let it of product.variants.edges){
            if(it.node.id === e){
                if(it.node.quantityAvailable > 0 && it.node.availableForSale){
                    setAvailableForSale(it.node.availableForSale);
                }else{
                    setAvailableForSale(false);
                }
            }
        }
    }

    const handleAddToCart = async () => {
        let cartId = sessionStorage.getItem("cartId");
        
        let sellPlanId = null;
        if(selectedOffer){
            sellPlanId = selectedOffer.id;
        }

        if (quantity > 0) {
          if (cartId) {

            let bodyData = { cartId, varId: selectedVariant, quantity, type: 'UPDATE_CART' };
            if(sellPlanId){
                bodyData.sellingPlanId = sellPlanId;
            }

            let settings = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            }
            let response = await fetch('/api/cart', settings);
            let data = await response.json();

            setCheckout(true);
            cartTotal(data.cartId);
            setQuantity(0);
          } else {

            let bodyData = { varId: selectedVariant, quantity, type: 'ADD_TO_CART' };
            if(sellPlanId){
                bodyData.sellingPlanId = sellPlanId;
            }

            let settings = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            }
            let response = await fetch('/api/cart', settings);
            let data = await response.json();

            sessionStorage.setItem("cartId", data.cartId);
            setCheckout(true);
            setQuantity(0);
            cartTotal(data.cartId);
          }
        }
    };

    return (
        <div className="mt-24">
            <div className="product-details px-4 md:px-12 py-8 md:py-12">
                <div className="left">
                    <Suspense fallback={"Loading data...."}>
                        <ImageGallery lazyLoad={true} items={imagesArray} thumbnailPosition={"left"} showFullscreenButton={false} showPlayButton={false} showNav={false} showBullets={true} />
                    </Suspense>
                </div>
                <div className="right md:w-1/2">
                    <nav className="mb-4 text-sm text-gray-600">
                        <Link href="/">Home</Link> &gt; <Link href="/products">Products</Link> &gt; <span>{product.title}</span>
                    </nav>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                        <h3 className="text-xl text-gray-700 mb-4">
                            { varCompPrice?.amount && <span className={`line-through text-[#7d7d7d]`}> $ {varCompPrice?.amount}</span>  }
                            { varPrice?.amount && <span> $ {varPrice?.amount}</span> }
                        </h3> 

                        <div className="mb-4 flex">
                            {Array.from({ length: Number(product.rating.value) }, (_, i) => 
                                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 1L13 7L19 7.75L14.88 12.37L16 19L10 16L4 19L5.13 12.37L1 7.75L7 7L10 1Z" fill="#FFC700"/>
                                </svg>
                            )}
                        </div>

                    </div>
                    <label className="block text-2xl font-semibold text-gray-700">Quantity:</label>
                    <div className="flex flex-col items-start mt-4">
                       <div className="flex items-center justify-between h-12 w-auto">
                            <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="text-lg text-gray-400 px-2 bg-[#0348be] hover:bg-[#013396]">
                                -
                            </button>
                            <input value={quantity} onChange={updateQuantity} type="number" min={0}  className="text-center w-12" />
                            <button onClick={() => setQuantity(quantity + 1)} className="text-lg text-gray-400 bg-[#0348be] hover:bg-[#013396]">
                                +
                            </button>
                       </div>
                       <div className="mt-5">
                        { product.sellingPlanGroups.nodes.length > 0 && <h4 className="text-lg font-semibold">Choose an Offer:</h4> }
                        <div className="flex flex-col mt-4">
                        {product?.sellingPlanGroups.nodes ? (
                            <div className="sellingPlans flex flex-col gap-4">
                                { product.sellingPlanGroups.nodes.length > 0 && 
                                    <div>
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="offer"
                                                    value={"null"}
                                                    onChange={() => handleSellingPlanChange(null)}
                                                    style={{height:"20px", width:'20px'}}
                                                    defaultChecked={"checked"}
                                                />
                                                <span>One Time Subscription</span>
                                            </label>
                                        </div>
                                    </div> 
                                }
                                { product.sellingPlanGroups.nodes.map((group, index) => (
                                    <div key={index}>
                                        {
                                            group.sellingPlans.nodes.map((data, _i) => (
                                                <div key={_i}>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="offer"
                                                            value={data.id}
                                                            onChange={() => handleSellingPlanChange(data)}
                                                            style={{height:"20px", width:'20px'}}
                                                        />
                                                        <span>{data.name}</span>
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    
                                )) }
                            </div>
                            
                        ) : (
                            <p>No subscription options available</p>
                        )}
                        </div>

                    </div>
                    </div>
                    <div className="mt-4 flex w-auto gap-x-4">
                        {availableForSale && selectedVariant ? (
                            <>
                                <button onClick={handleAddToCart} className={`w-auto text-white px-4 py-2 rounded hover:bg-[#013396] justify-self-start ${quantity === 0 ? 'pointer-events-none bg-[#cbd5e1]' : 'bg-[#0348be]'}`}>
                                    Add to Cart
                                </button>
                            </>
                        ) : (<p className="text-[#cf0000] font-bold">Item is not available for sale</p>) }
                        {checkout && (
                            <Link className="viewCartCta justify-self-start hover:bg-[#013396]" href={`/cart?cartid=${sessionStorage.getItem("cartId")}`}>
                                View Cart
                            </Link>
                        )}
                    </div>
                    {product.options.length > 0 && (
                        <div className="gap-4 flex flex-col" ref={prodVariantRef}>
                            {product.options.map((edge,i) => (
                                <div key={i}>
                                    {edge.name != 'Title' && (
                                        <>
                                            <h5 className={`${i == 0 ? 'mt-4 capitalize' : 'capitalize'}`}>{edge.name}:</h5>
                                            <div className="flex gap-4 mt-4">
                                                {edge.optionValues.map((opt,ind) => (
                                                    <div key={ind}>
                                                        {opt.name != 'Default Title' && (
                                                            <>
                                                                <input className="hidden" id={`radio_${ind}_${edge.name}`} value={opt.name} data-opname={edge.name} type="radio" name={`variantOption${i}`}/>
                                                                <label onClick={() => handleVariant(edge.name, opt.name, i)} className="flex flex-col p-4 border-2 border-gray-400 cursor-pointer" htmlFor={`radio_${ind}_${edge.name}`}>
                                                                    <span className="text-xs font-semibold uppercase">{opt.name}</span>
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {product.variants.edges.length > 1 && (
                            <div className="mb-4 mt-4 hidden">
                                <label className="block text-gray-700 mb-2">Choose Variant:</label>
                                <select
                                    value={selectedVariant}
                                    onChange={(e) => changeVariantValue(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-1/2"
                                >
                                    {product.variants.edges.map(edge => (
                                        <option key={edge.node.id} data-cprice={edge.node?.compareAtPrice?.amount} data-price={edge.node?.price?.amount} value={edge.node.id}>
                                            {edge.node.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
                        <p className="text-gray-600">{product.description}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-12">
                <h2 className="text-center text-xl md:text-3xl mb-4 md:mb-8">Related Products</h2>
            </div>

            <div className="productsList px-4 md:px-12 pb-8 md:pb-12">
                {product.collection.reference.products.nodes.map((product) => {
                    return <ProductCard key={product.id} product={product} />;
                })}
            </div>
            
            <div className="flex mx-4 md:mx-12 mb-8 md:mb-12 justify-center">
                <Link href={`/collections/${product.collection.reference.handle}`} className="bg-[#0348be] px-6 py-3 text-white font-bold uppercase rounded">Show More</Link>
            </div>
            
        </div>
    )
}

export default ProductDetails