import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ArrowForward from '@mui/icons-material/ArrowForward';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Facebook from '@mui/icons-material/Facebook';

const Register = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumberId: '',
    apiToken: '',
    terms: false
  });
  const [showApiToken, setShowApiToken] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          console.log('Facebook Signup Response:', response);
          // Simulate WhatsApp credentials for demo purposes
          setFormData(prev => ({
            ...prev,
            phoneNumberId: 'mock_phone_number_id_12345',
            apiToken: 'mock_access_token_abcde',
            email: response.authResponse.email || prev.email
          }));
          // Optionally navigate to dashboard
          navigate('/dashboard');
        } else {
          alert('User cancelled signup or did not fully authorize.');
        }
      },
      {
        scope: 'whatsapp_business_management,whatsapp_business_messaging,email',
        extras: {
          feature: 'whatsapp_embedded_signup',
          sessionInfoVersion: 2
        }
      }
    );
  };

  const handleManualRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!formData.terms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    console.log('Manual registration submitted:', formData);
    // Simulate successful registration
    navigate('/dashboard');
  };

  const toggleApiTokenVisibility = () => {
    setShowApiToken(!showApiToken);
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-sm p-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-blue-600 text-3xl" />
            <h1 className="text-xl font-bold text-gray-900">WhatsApp Business Manager</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Documentation</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="md:grid md:grid-cols-5">
            {/* Left Panel - Registration Form */}
            <div className="p-8 md:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Create a New Account</h2>
                <p className="mt-2 text-gray-600">Get started with managing your WhatsApp Business account.</p>
              </div>

              {/* Facebook Login Button */}
              <button 
                onClick={handleFacebookLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors mb-6"
              >
                <Facebook className="mr-3 text-xl" />
                Continue with Facebook
              </button>
              <p className="text-sm text-gray-600 mb-8">Use your Meta account to quickly sign up and connect your WhatsApp Business API.</p>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Registration Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input 
                    type="text" 
                    id="businessName" 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
                    placeholder="Your Business Name" 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
                    placeholder="yourname@company.com" 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
                    placeholder="Minimum 8 characters" 
                    required
                    minLength="8"
                  />
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters with letters and numbers</p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
                    placeholder="Re-enter your password" 
                    required
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">WhatsApp Business API Credentials</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="phoneNumberId" className="block text-sm font-medium text-gray-700">Phone Number ID</label>
                    <input 
                      type="text" 
                      id="phoneNumberId" 
                      name="phoneNumberId"
                      value={formData.phoneNumberId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
                      placeholder="Your WhatsApp Phone Number ID" 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">API Key/Token</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input 
                        type={showApiToken ? "text" : "password"}
                        id="apiToken" 
                        name="apiToken"
                        value={formData.apiToken}
                        onChange={handleInputChange}
                        className="flex-grow block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
                        placeholder="Your WhatsApp API Token" 
                      />
                      <button
                        type="button"
                        onClick={toggleApiTokenVisibility}
                        className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        {showApiToken ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    <a href="https://developers.facebook.com/docs/whatsapp/embedded-signup" className="text-blue-600 hover:text-blue-500 inline-flex items-center">
                      Where to find these credentials?
                      <OpenInNew className="ml-1 text-sm" />
                    </a>
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the 
                      <a href="#" className="text-blue-600 hover:text-blue-500 mx-1">Terms of Service</a>
                      and
                      <a href="#" className="text-blue-600 hover:text-blue-500 ml-1">Privacy Policy</a>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={handleManualRegister}
                  data-testid="submit-button"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign Up
                </button>
              </div>
              
              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account? 
                <button 
                  onClick={handleLogin}
                  className="font-medium text-blue-600 hover:text-blue-500 ml-1 cursor-pointer"
                >
                  Login here
                </button>
              </p>
              
              <p className="mt-2 text-center text-sm text-gray-600">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Need help with registration?</a>
              </p>
            </div>

            {/* Right Panel - Image and Info */}
            <div className="hidden md:block md:col-span-2 bg-blue-50 p-8">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits of Registration</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">Full access to WhatsApp Business API features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">Comprehensive analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">Automated message templates and workflows</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">Seamless integration with your business tools</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MzkyNDZ8MHwxfHNlYXJjaHwxfHxidXNpbmVzc3xlbnwwfHx8fDE3MTA3ODIyMTB8MA&ixlib=rb-4.0.3&q=80&w=1080" 
                    alt="WhatsApp Business Communication" 
                    className="rounded-lg shadow-md object-cover h-48 w-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="mt-8">
                  <p className="text-sm text-gray-600">Need help with registration?</p>
                  <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                    View our setup guide <ArrowForward className="ml-1 text-sm" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2025 WhatsApp Business Manager. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;