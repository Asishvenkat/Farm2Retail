import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfessionalFarm2Market = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Support for Farmers',
      description: `Farm2Market enables farmers to list their produce with complete control over pricing and availability. Farmers can track real-time orders, manage inventory, and receive direct payments—eliminating middlemen and boosting profitability. With built-in support for scheduling deliveries and transparent communication tools, farmers stay in charge from harvest to delivery.`,
      image:
        'https://as2.ftcdn.net/v2/jpg/02/50/10/17/1000_F_250101768_Qhn6oFRCgQArmI5Ov5EY3EOtYTTHpOg5.jpg',
    },
    {
      title: 'Reliable Retail Supply',
      description: `Retailers gain access to a wide range of verified farm produce at fair prices. Our smart search and filtering tools make it easy to browse seasonal availability, compare quality, and place bulk orders efficiently. Integrated logistics tracking and secure payment gateways ensure hassle-free procurement and delivery directly from farms to shelves.`,
      image:
        'https://cdn.corporatefinanceinstitute.com/assets/supply-1024x480.jpeg',
    },
    {
      title: 'Transparent System',
      description: `Farm2Market offers a fully traceable system where every transaction—from farm listing to delivery—is logged and verifiable. Digital receipts, automated tax reports, payment tracking, and delivery confirmations provide unmatched trust and accountability. This transparency ensures both farmers and retailers are protected and informed at all times.`,
      image:
        'https://marcustoday.com.au/wp-content/uploads/2022/09/Retirement-Today-Trust.png',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F2M</span>
              </div>
              <span
                className={`text-xl font-bold ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}
              >
                Farm2Market
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={`font-medium hover:text-green-600 transition-colors ${scrollY > 50 ? 'text-gray-700' : 'text-white'}`}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className={`font-medium hover:text-green-600 transition-colors ${scrollY > 50 ? 'text-gray-700' : 'text-white'}`}
              >
                How It Works
              </a>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-green-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu
                  className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
              >
                How It Works
              </a>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="block w-full bg-green-500 text-white px-3 py-2 rounded-md mt-2"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&h=1080&fit=crop"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Revolutionizing
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {' '}
                Agriculture
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect farmers directly with retailers. Eliminate middlemen.
              Ensure fair prices. Build sustainable agricultural communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {/* <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all">
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Farm2Market?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to empower every stakeholder in the
              agricultural value chain
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-10 ${
                  index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className="md:w-1/2">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-80 object-cover rounded-xl shadow-md"
                  />
                </div>

                {/* Text */}
                <div className="md:w-1/2">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple. Effective. Reliable.
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just four easy steps
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-green-200 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  desc: 'Sign up as a Farmer to sell your produce or as a Retailer to source directly from farms. Quick and easy registration.',
                  icon: Users,
                },
                {
                  step: '02',
                  title: 'List or Browse Products',
                  desc: 'Farmers can upload product details with images and pricing. Retailers can explore the marketplace for fresh produce.',
                  icon: TrendingUp,
                },
                {
                  step: '03',
                  title: 'Place Orders & Confirm',
                  desc: 'Retailers place bulk or custom orders. Farmers receive order requests and confirm availability directly.',
                  icon: Shield,
                },
                {
                  step: '04',
                  title: 'Coordinate Delivery & Payment',
                  desc: 'Once confirmed, both parties coordinate offline for pickup or local delivery. Payments are handled securely through the platform.',
                  icon: Clock,
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <item.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-green-600 shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers and retailers already benefiting from our
            platform
          </p>
          <div
            onClick={() => navigate('/register')}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-all">
              Join Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F2M</span>
                </div>
                <span className="text-xl font-bold">Farm2Market</span>
              </div>
              <p className="text-gray-400">
                Connecting farmers and retailers for a sustainable agricultural
                future.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Farmers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Retailers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

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
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Farm2Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalFarm2Market;
