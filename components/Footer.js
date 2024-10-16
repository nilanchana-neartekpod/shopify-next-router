import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
      <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-36 justify-normal mb-24 items-stretch">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-2">Shop Smarter</h2>
          <p className="text-gray-600 text-base font-normal mt-5">
            400 University Drive Suite 200 Coral Gables,<br />FL 33134 USA
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-gray-500 text-base font-medium mb-2">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-base hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/products" className="text-base hover:underline">Shop</Link>
              </li>
              <li>
                <Link href="/about" className="text-base hover:underline">About</Link>
              </li>
              <li>
                <Link href="/contact" className="text-base hover:underline">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-gray-500 text-base font-medium mb-2">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className=" text-base  font-medium hover:underline">Payment Options</Link>
              </li>
              <li>
                <Link href="/help" className=" text-base font-medium hover:underline">Returns</Link>
              </li>
              <li>
                <Link href="/help" className=" text-base font-medium hover:underline">Privacy Policies</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-base text-gray-500 font-medium mb-2">Newsletter</h3>
          <form className="flex-wrap">
            <input type="email" placeholder="Enter your email address" className="border rounded-md px-2 py-1" />
            <div className="">
              <button type="submit" className="text-white bg-[#0348be] font-sm py-1 px-6 rounded">Subscribe</button>
            </div>
          </form>
        </div>
      </div>

        <hr/>
        <div className="mt-5 text-start">
          <p className="text-gray-600 text-sm font-normal"> 2024 Shop Smarter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
