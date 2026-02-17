import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../constants';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const roleOptions = [
    { value: USER_ROLES.OWNER, label: 'Farm Owner' },
    { value: USER_ROLES.LESSEE, label: 'Farmer/Lessee' },
    { value: USER_ROLES.DEALER, label: 'Agro-Dealer' },
    // Admin role is hidden from registration
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step === 1 && formData.role) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("https://cropnuts.com/wp-content/uploads/2020/02/Crops.png")` 
      }}
    >
      <div className="max-w-md w-full">
        {/* Header - Glassmorphism style */}
        <div className="text-center mb-8 bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-white drop-shadow-md">FarmLease</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-100">Join the FarmLease community</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-full backdrop-blur-sm">
            <div className={`h-2.5 w-16 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-primary-500' : 'bg-gray-400'}`} />
            <div className={`h-2.5 w-16 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-400'}`} />
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-2xl border-t-4 border-primary-500">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Step 1: Select Your Role</h3>
                  <Select
                    label="I am a..."
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={roleOptions}
                    placeholder="Select your role"
                    required
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3"
                  disabled={!formData.role}
                >
                  Next
                </Button>
              </>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Step 2: Personal Information</h3>
                  
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 700 000 000"
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;