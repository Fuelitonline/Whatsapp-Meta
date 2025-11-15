import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CheckCircle from '@mui/icons-material/CheckCircle';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const Login = () => {
  const [fbLoaded, setFbLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load Facebook SDK and check login status
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) {
      if (window.FB) {
        setFbLoaded(true);
        checkLoginStatus();
      }
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: import.meta.env.VITE_WHATSAPP_API_VERSION || "v23.0",
      });
      window.FB.AppEvents.logPageView();
      setFbLoaded(true);
      checkLoginStatus();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onerror = () => {
        setError("Failed to load Facebook SDK. Please check your network.");
        setFbLoaded(false);
      };
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // Check Facebook login status
  const checkLoginStatus = () => {
    if (!window.FB) {
      setError("Facebook SDK not loaded.");
      return;
    }

    window.FB.getLoginStatus((response) => {
      statusChangeCallback(response);
    });
  };

  // Handle login status response
  const statusChangeCallback = async (response) => {
    console.log("FB.getLoginStatus response:", response);

    if (response.status === "connected" && response.authResponse?.accessToken) {
      // User is logged into Facebook and the app
      try {
        setIsLoggingIn(true);
        const apiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,   
          { accessToken: response.authResponse.accessToken },
          { withCredentials: true }
        );

        if (apiResponse.data.success) {
          localStorage.setItem("token", apiResponse.data.token);
          console.log("Login successful:", apiResponse.data.user);
          navigate("/dashboard");
        } else {
          setError(apiResponse.data.error || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("API error:", error);
        setError(
          error.response?.data?.error || "Failed to authenticate. Please try again."
        );
      } finally {
        setIsLoggingIn(false);
      }
    } else if (response.status === "not_authorized" || response.status === "unknown") {
      // User is not logged into the app or Facebook
      console.log("User not logged in or not authorized:", response.status);
      // Show the login button (handled by XFBML)
    } else {
      setError("Unknown login status. Please try again.");
    }
  };

  // Listen for WhatsApp signup response
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.origin.endsWith("facebook.com")) return;

      try {
        if (typeof event.data !== "string") return;

        const trimmed = event.data.trim();
        if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return;

        const data = JSON.parse(trimmed);

        if (data.type === "WA_EMBEDDED_SIGNUP" && data.code) {
          console.log("WA_EMBEDDED_SIGNUP event:", data);
          fbLoginCallback({ authResponse: { code: data.code } });
        }
      } catch (err) {
        console.error("Message event error:", err.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Handle FB login response (for WhatsApp Embedded Signup)
  const fbLoginCallback = async (response) => {
    setIsLoggingIn(false);

    if (response.authResponse?.code) {
      try {
        const apiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          { code: response.authResponse.code },
          { withCredentials: true }
        );

        if (apiResponse.data.success) {
          localStorage.setItem("token", apiResponse.data.token);
          console.log("Login successful:", apiResponse.data.user);
          navigate("/dashboard");
        } else {
          setError(apiResponse.data.error || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("API error:", error);
        const errorMessage =
          error.response?.data?.error || "Failed to authenticate. Please try again.";
        setError(errorMessage);
      }
    } else {
      console.log("Facebook login response:", response);
      setError("Facebook login was cancelled or failed.");
    }
  };

  // Function for onlogin attribute
  window.checkLoginState = function () {
    if (!window.FB) {
      setError("Facebook SDK not loaded.");
      return;
    }
    setIsLoggingIn(true);
    window.FB.getLoginStatus((response) => {
      statusChangeCallback(response);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="md:grid md:grid-cols-5">
            {/* Left Panel - Login Form */}
            <div className="p-8 md:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Sign In to FIO's WABM</h2>
                <p className="mt-2 text-gray-600">Access your FIO's WABM dashboard to manage WhatsApp Business API.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Facebook Login Button */}
              <div
                className={`fb-login-button ${!fbLoaded || isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-size="large"
                data-button-type="continue_with"
                data-layout="rounded"
                data-auto-logout-link="false"
                data-use-continue-as="true"
                data-width=""
                data-scope="whatsapp_business_management,whatsapp_business_messaging"
                data-onlogin="checkLoginState"
                data-config-id={import.meta.env.VITE_FACEBOOK_CONFIG_ID}
                data-response-type="code"
                data-override-default-response-type="true"
                data-extras={JSON.stringify({
                  setup: {},
                  featureType: "WHATSAPP",
                  sessionInfoVersion: "3",
                })}
              ></div>
              <p className="text-sm text-gray-600 mt-4 mb-8">
                Use your Meta account to quickly sign in and manage your WhatsApp Business API.
              </p>
            </div>

            {/* Right Panel - Image and Info */}
            <div className="hidden md:block md:col-span-2 bg-blue-50 p-8">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits of Signing In</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">Full access to FIO's WABM features</span>
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
                    alt="FIO's WABM Dashboard"
                    className="rounded-lg shadow-md object-cover h-48 w-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-600">Need help with login?</p>
                  <a
                    href="https://developers.facebook.com/docs/whatsapp/embedded-signup"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View our setup guide <ArrowForward className="ml-1 text-sm" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;