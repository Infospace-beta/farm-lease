import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to FarmLease Platform
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Connecting farm owners with aspiring farmers and agro-dealers...
              Find verified agricultural land, lease with confidence, and get AI-powered crop recommendations.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-50">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farm Owners */}
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-xl font-semibold mb-3">For Farm Owners</h3>
              <p className="text-gray-600">
                List your agricultural land, get verified, and lease to qualified farmers securely.
              </p>
            </div>

            {/* Lessees */}
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold mb-3">For Farmers</h3>
              <p className="text-gray-600">
                Browse verified lands, lease with escrow protection, and get AI crop recommendations.
              </p>
            </div>

            {/* Agro-Dealers */}
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-3">For Agro-Dealers</h3>
              <p className="text-gray-600">
                List your agricultural products and connect with farmers across Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Verified Lands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
              <div className="text-gray-600">Agro-Dealers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
