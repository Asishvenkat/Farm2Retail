import {
  Facebook,
  Instagram,
  MailOutline,
  Phone,
  Pinterest,
  Room,
  Twitter,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold">AgroTrade</span>
            </div>
            <p className="text-gray-400">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                <Facebook fontSize="small" />
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                <Instagram fontSize="small" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                <Twitter fontSize="small" />
              </div>
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                <Pinterest fontSize="small" />
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cart
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Farmer Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Retailer Offers
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Order Tracking
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center">
                <Room style={{ marginRight: '10px' }} />
                8-57-5, Tagarapuvalasa, Visakhapatnam, AP - 531162
              </li>
              <li className="flex items-center">
                <Phone style={{ marginRight: '10px' }} />
                +91 9133229547
              </li>
              <li className="flex items-center">
                <MailOutline style={{ marginRight: '10px' }} />
                contact@AgroTrade.com
              </li>
              <li>
                <img
                  src="https://i.ibb.co/Qfvn4z6/payment.png"
                  alt="payment methods"
                  className="w-1/2 mt-2"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AgroTrade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
