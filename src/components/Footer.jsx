import {  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaApple,
  FaGooglePlay,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,} from "react-icons/fa";

  import caralogo from "../assets/caralogo.png";


export default function Footer() {
  return (
     <footer className="bg-white border-t border-gray-100 pt-12 pb-6 px-6 md:px-12 font-sans">
      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 mb-10" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
 
        {/* Brand + Contact */}
        <div className="-mt-4">
          <img src={caralogo} alt="CaraStore Logo" className="w-32 mb-4 -ml-4" />
 
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            562 Wellington Road, Street 32, San Francisco
          </p>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Phone:</span>{" "}
            +01 2222 345 / (+91) 0 123 456 789
          </p>
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-semibold text-gray-700">Hours:</span>{" "}
            10:00 – 18:00, Mon – Sat
          </p>
 
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Follow us</h3>
          <div className="flex gap-2">
            {[
              { icon: <FaFacebookF />, label: "Facebook" },
              { icon: <FaTwitter />, label: "Twitter" },
              { icon: <FaInstagram />, label: "Instagram" },
              { icon: <FaPinterestP />, label: "Pinterest" },
              { icon: <FaYoutube />, label: "YouTube" },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors text-xs"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
 
        {/* About */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">About</h3>
          <ul className="space-y-2.5">
            {["About us", "Delivery Information", "Privacy Policy", "Terms & Conditions", "Contact Us"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
 
        {/* My Account */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">My Account</h3>
          <ul className="space-y-2.5">
            {["Sign In", "View Cart", "My Wishlist", "Track My Order", "Help"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
 
        {/* Install App + Payments */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Install App</h3>
          <p className="text-sm text-gray-400 mb-3">From App Store or Google Play</p>
 
          <div className="flex flex-row gap-2 mb-5">
            {/* App Store */}
            <a
              href="#"
              className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 py-2 w-fit hover:border-gray-400 transition-colors"
            >
              <FaApple className="text-gray-800 text-xl" />
              <div>
                <span className="block text-[10px] text-gray-400 leading-none mb-0.5">Download on the</span>
                <span className="block text-xs font-semibold text-gray-800">App Store</span>
              </div>
            </a>
 
            {/* Google Play */}
            <a
              href="#"
              className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 py-2 w-fit hover:border-gray-400 transition-colors"
            >
              <FaGooglePlay className="text-gray-800 text-lg" />
              <div>
                <span className="block text-[10px] text-gray-400 leading-none mb-0.5">Get it on</span>
                <span className="block text-xs font-semibold text-gray-800">Google Play</span>
              </div>
            </a>
          </div>
 
          <p className="text-xs text-gray-400 mb-2">Secured Payment Gateways</p>
          <div className="flex gap-2 items-center flex-wrap">
            {[
              { icon: <FaCcVisa />, label: "Visa" },
              { icon: <FaCcMastercard />, label: "Mastercard" },
              { icon: <FaCcPaypal />, label: "PayPal" },
              { icon: <FaCcAmex />, label: "Amex" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                title={label}
                className="border border-gray-200 rounded px-2 py-1.5 text-gray-500 text-lg flex items-center"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
 
      {/* Bottom bar */}
      <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
        © 2023, Sahad cmd – HTML CSS Ecommerce Template
      </div>
    </footer>
  );
}
 
