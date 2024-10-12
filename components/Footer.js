import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Shop Smarter with AI</h2>
            <p className="text-gray-600 text-sm">
              400 University Drive Suite 200 Coral Gables,<br />FL 33134 USA
            </p>
          </div>

          {/* Applying gap-5 to each section */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 gap-5">
            <div>
              <h3 className="text-gray-800 text-sm font-medium mb-2">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 text-sm hover:underline">Home</Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-600 text-sm hover:underline">Shop</Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 text-sm hover:underline">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 text-sm hover:underline">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-800 text-sm font-medium mb-2">Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-600 text-sm hover:underline">Payment Options </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 text-sm hover:underline">Returns</Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 text-sm hover:underline">Privacy Policies</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-800 text-sm font-medium mb-2">Newsletter</h3>
              <form>
                <input type="email" placeholder="Enter your email address" className="border rounded-md px-2 py-1" />
                <button type="submit" className="text-white bg-[#0348be] font-sm py-1 px-4 rounded">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        <hr/>
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm"> 2024 Shop Smarter with AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
