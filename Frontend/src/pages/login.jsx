import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const Login = () => {
  const [fbLoaded, setFbLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loginTimeoutRef = useRef(null);

  // ================= Exchange Code with Backend =================
  const exchangeCode = useCallback(
    async (code) => {
      try {
        console.log('🔵 Starting code exchange...');
        console.log('🔵 Code received:', code?.substring(0, 50) + '...');

        setIsLoggingIn(true);
        setError(null);
        if (loginTimeoutRef.current) {
          clearTimeout(loginTimeoutRef.current);
        }

        const API_URL = import.meta.env.VITE_API_URL;
        console.log('🔵 API URL:', API_URL);

        const response = await axios.post(
          `${API_URL}/api/auth/embedded-login`,
          { code },
          {
            withCredentials: true,
            timeout: 30000,
          }
        );

        console.log('🟢 API Response:', response.data);
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user || {}));
          navigate('/dashboard', { replace: true });
        } else {
          setError(response.data.error || 'Login failed.');
          setIsLoggingIn(false);
        }
      } catch (error) {
        console.error('❌ Login API Error:', error);

        let errorMsg = 'Network error. Please try again.';
        if (error.response?.data?.error) {
          errorMsg = error.response.data.error;
        } else if (error.code === 'ECONNABORTED') {
          errorMsg = 'Request timeout. Please try again.';
        }

        setError(errorMsg);
        setIsLoggingIn(false);
      }
    },
    [navigate]
  );

  // ================= Enhanced Message Listener =================
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('📩 Message from origin:', event.origin);

      const allowedOrigins = [
        'https://www.facebook.com',
        'https://web.facebook.com',
        'https://facebook.com',
      ];

      if (!allowedOrigins.some((origin) => event.origin.startsWith(origin))) {
        console.log('❌ Ignoring message from:', event.origin);
        return;
      }

      console.log('📩 Raw message data type:', typeof event.data);
      console.log('📩 Raw message data length:', event.data?.length);

      // Handle string messages
      if (typeof event.data === 'string') {
        console.log('📩 String message content (first 200 chars):', event.data.substring(0, 200));

        // Method 1: Look for code in URL parameters
        if (event.data.includes('code=')) {
          console.log('✅ Found code= in string message');

          try {
            const urlParams = new URLSearchParams(event.data.split('?')[1] || '');
            const code = urlParams.get('code');

            if (code) {
              console.log('✅ Extracted code from URL params');
              exchangeCode(code);
              return;
            }
          } catch (error) {
            console.error('❌ Error parsing URL params:', error);
          }
        }

        // Method 2: Try to parse as JSON
        if (event.data.trim().startsWith('{')) {
          try {
            const data = JSON.parse(event.data);
            console.log('✅ Parsed JSON data:', data);

            if (data.type === 'WA_EMBEDDED_SIGNUP' && data.event === 'FINISH' && data.code) {
              console.log('✅ WhatsApp Embedded Signup completed with code');
              exchangeCode(data.code);
              return;
            }
          } catch (error) {
            console.error('❌ Error parsing JSON:', error);
          }
        }

        // Method 3: Look for code in the string directly
        const codeMatch = event.data.match(/code=([^&]+)/);
        if (codeMatch && codeMatch[1]) {
          console.log('✅ Extracted code using regex');
          exchangeCode(codeMatch[1]);
          return;
        }

        console.log('❌ No code found in string message');
        return;
      }

      // Handle object messages
      if (typeof event.data === 'object' && event.data !== null) {
        console.log('✅ Object message received:', event.data);

        if (event.data.type === 'WA_EMBEDDED_SIGNUP' && event.data.event === 'FINISH' && event.data.code) {
          console.log('✅ WhatsApp Embedded Signup completed with code');
          exchangeCode(event.data.code);
          return;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('✅ Message listener activated');

    return () => {
      window.removeEventListener('message', handleMessage);
      console.log('✅ Message listener removed');
    };
  }, [exchangeCode]);

  // ================= Load Facebook SDK =================
  useEffect(() => {
    if (window.FB) {
      console.log('✅ Facebook SDK already loaded');
      setFbLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      console.log('✅ Facebook SDK initialized');

      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: import.meta.env.VITE_WHATSAPP_API_VERSION || 'v19.0',
        status: true,
      });

      console.log('✅ FB SDK initialized with App ID:', import.meta.env.VITE_FACEBOOK_APP_ID);
      setFbLoaded(true);
    };

    // Load SDK
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;

      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';

      js.onload = () => console.log('✅ Facebook SDK script loaded');
      js.onerror = (e) => {
        console.error('❌ Failed to load Facebook SDK:', e);
        setError('Failed to load Facebook SDK. Please refresh.');
      };

      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // ================= Launch WhatsApp Embedded Signup =================
  const launchWhatsAppSignup = () => {
    console.log('🟡 Starting WhatsApp login...');
    console.log('🟡 Config ID:', import.meta.env.VITE_FACEBOOK_CONFIG_ID);

    if (!fbLoaded || !window.FB) {
      setError('Facebook SDK not ready. Please wait...');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    // Set timeout
    loginTimeoutRef.current = setTimeout(() => {
      console.log('❌ Login timeout');
      setError('Login timeout. Please try again.');
      setIsLoggingIn(false);
    }, 120000);

    console.log('🟢 Calling FB.login...');

    // Use FB.login for WhatsApp Embedded Signup
    window.FB.login(
      (response) => {
        console.log('🟢 FB.login callback received');
        console.log('🔵 Response:', response);

        if (loginTimeoutRef.current) {
          clearTimeout(loginTimeoutRef.current);
        }

        if (response.authResponse) {
          console.log('✅ User authorized the app');
          console.log('⏳ Waiting for WhatsApp signup completion...');
        } else {
          console.log('❌ User cancelled login');
          setError('Login was cancelled. Please try again.');
          setIsLoggingIn(false);
        }
      },
      {
        config_id: import.meta.env.VITE_FACEBOOK_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          featureType: 'WHATSAPP_EMBEDDED_SIGNUP',
          setup: {
            version: '3',
          },
        },
      }
    );
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="md:grid md:grid-cols-5">
            {/* Left Side */}
            <div className="p-8 md:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In to WhatsApp Business</h2>
              <p className="text-gray-600 mb-6">Connect your WhatsApp Business Account to get started.</p>

              {/* Debug Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded text-sm space-y-1">
                <div>
                  Facebook SDK:{' '}
                  <span className={fbLoaded ? 'text-green-600 font-medium' : 'text-yellow-600'}>
                    {fbLoaded ? '✅ Loaded' : '⏳ Loading...'}
                  </span>
                </div>
                <div>
                  App ID: <span className="text-gray-600">{import.meta.env.VITE_FACEBOOK_APP_ID ? '✅ Set' : '❌ Missing'}</span>
                </div>
                <div>
                  Config ID:{' '}
                  <span className="text-gray-600">{import.meta.env.VITE_FACEBOOK_CONFIG_ID ? '✅ Set' : '❌ Missing'}</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <button
                onClick={launchWhatsAppSignup}
                disabled={isLoggingIn || !fbLoaded}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] disabled:bg-gray-400 disabled:hover:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors mb-4"
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting to WhatsApp...
                  </div>
                ) : (
                  'Continue with WhatsApp Business'
                )}
              </button>

              <div className="text-xs text-gray-500 text-center">You will be redirected to Meta for authentication</div>
            </div>

            {/* Right Side */}
            <div className="hidden md:block md:col-span-2 bg-green-50 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What You will Get</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  WhatsApp Business API Access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  Message Templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  Customer Management
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  Analytics Dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
