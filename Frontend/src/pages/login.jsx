import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../component/webHeader";
import Footer from "../component/webFooter";

const Login = () => {
  const [fbLoaded, setFbLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Main Login Function - Exchange Code with Backend
  const exchangeCode = useCallback(
    async (code) => {
      try {
        setIsLoggingIn(true);
        setError(null);

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/embedded-login`, // Correct Route
          { code },
          { withCredentials: true }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user || {}));
          navigate("/dashboard", { replace: true });
        } else {
          setError(data.error || "Login failed. Please try again.");
        }
      } catch (e) {
        console.error("Login error:", e);
        const msg =
          e.response?.data?.error ||
          e.message ||
          "Network error. Please check your connection and try again.";
        setError(msg);
      } finally {
        setIsLoggingIn(false);
      }
    },
    [navigate]
  );

  // Listen for postMessage from Facebook Embedded Signup
  useEffect(() => {
    const handler = (e) => {
      if (!e.origin.includes("facebook.com") && !e.origin.includes("fb.com"))
        return;

      const payload = e.data;
      if (typeof payload !== "string") return;

      try {
        const data = JSON.parse(payload.trim());
        if (data.type === "WA_EMBEDDED_SIGNUP" && data.event === "FINISH" && data.code) {
          exchangeCode(data.code);
        }
      } catch {
        // Ignore invalid messages
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [exchangeCode]);

  // Load Facebook SDK
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) {
      if (window.FB) setFbLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: import.meta.env.VITE_WHATSAPP_API_VERSION || "v20.0",
      });
      setFbLoaded(true);
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onerror = () => setError("Failed to load Facebook SDK");
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // Trigger WhatsApp Embedded Signup
  const launchWhatsAppSignup = () => {
    if (!fbLoaded || !window.FB) {
      setError("Facebook SDK is still loading. Please wait...");
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    window.FB.login(
      () => { }, // We don't use callback → rely on postMessage
      {
        config_id: import.meta.env.VITE_FACEBOOK_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          featureType: "WHATSAPP",
          sessionInfoVersion: "3",
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="md:grid md:grid-cols-5">
            {/* Left Side - Login Form */}
            <div className="p-8 md:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sign In to FIO's WABM
                </h2>
                <p className="mt-2 text-gray-600">
                  Access your WhatsApp Business API dashboard.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={launchWhatsAppSignup}
                disabled={isLoggingIn || !fbLoaded}
                className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold py-4 rounded-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              >
                {isLoggingIn ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing you in...
                  </>
                ) : (
                  "Continue with WhatsApp Business"
                )}
              </button>

              <p className="text-sm text-gray-600 mt-6 text-center">
                Use your Meta account with WhatsApp Business access.
              </p>
            </div>

            {/* Right Side - Info */}
            <div className="hidden md:block md:col-span-2 bg-blue-50 p-8">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Benefits of Signing In
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Full access to FIO's WABM features",
                      "Comprehensive analytics dashboard",
                      "Automated message templates and workflows",
                      "Seamless integration with your business tools",
                    ].map((t) => (
                      <li key={t} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt="Business Dashboard"
                    className="rounded-lg shadow-md object-cover h-48 w-full"
                  />
                </div>

                <div className="mt-8">
                  <p className="text-sm text-gray-600">Need help?</p>
                  <a
                    href="https://developers.facebook.com/docs/whatsapp/embedded-signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View setup guide
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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