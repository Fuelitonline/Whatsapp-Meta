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

  // --------------------------------------------------------------
  //  Exchange Code for Token
  // --------------------------------------------------------------
  const exchangeCode = useCallback(
    async (code) => {
      try {
        setIsLoggingIn(true);
        setError(null);

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          { code },
          { withCredentials: true }
        );

        if (data.success) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          setError(data.error || "Login failed");
        }
      } catch (e) {
        setError(e.response?.data?.error || "Network error. Please try again.");
      } finally {
        setIsLoggingIn(false);
      }
    },
    [navigate]
  );

  // --------------------------------------------------------------
  //  postMessage Listener (Receives `code` from Embedded Signup)
  // --------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (!e.origin.endsWith("facebook.com") && !e.origin.endsWith("fb.com")) return;

      const payload = e.data;
      if (typeof payload !== "string") return;

      const trimmed = payload.trim();
      if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return;

      try {
        const data = JSON.parse(trimmed);
        if (data.type === "WA_EMBEDDED_SIGNUP" && data.code) {
          exchangeCode(data.code);
        }
      } catch {
        // Ignore malformed messages
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [exchangeCode]);

  // --------------------------------------------------------------
  //  Load Facebook SDK
  // --------------------------------------------------------------
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) {
      if (window.FB) {
        setFbLoaded(true);
      }
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false, // We don't use XFBML
        version: import.meta.env.VITE_WHATSAPP_API_VERSION || "v23.0",
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

  // --------------------------------------------------------------
  //  Manual Login with Embedded Signup
  // --------------------------------------------------------------
  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      setError("Facebook SDK not loaded");
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    window.FB.login(
      () => { }, // Callback not used — we rely on postMessage
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

  // --------------------------------------------------------------
  //  Render
  // --------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="md:grid md:grid-cols-5">
            {/* LEFT */}
            <div className="p-8 md:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sign In to FIO's WABM
                </h2>
                <p className="mt-2 text-gray-600">
                  Access your WhatsApp Business API dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Manual Button Only */}
              {fbLoaded && (
                <button
                  onClick={launchWhatsAppSignup}
                  disabled={isLoggingIn}
                  className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
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
                      Signing in…
                    </>
                  ) : (
                    "Continue with WhatsApp Business"
                  )}
                </button>
              )}

              <p className="text-sm text-gray-600 mt-6">
                Use your Meta account with WhatsApp Business access.
              </p>
            </div>

            {/* RIGHT */}
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
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MzkyNDZ8MHwxfHNlYXJjaHwxfHxidXNpbmVzc3xlbnwwfHx8fDE3MTA3ODIyMTB8MA&ixlib=rb-4.0.3&q=80&w=1080"
                    alt="Dashboard"
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
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
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