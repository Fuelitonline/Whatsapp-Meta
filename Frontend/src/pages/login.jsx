import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Header from "../component/webHeader";
import Footer from "../component/webFooter";

const Login = () => {
  const [fbLoaded, setFbLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --------------------------------------------------------------
  //  Memoized API helpers
  // --------------------------------------------------------------
  const exchangeAccessToken = useCallback(
    async (accessToken) => {
      try {
        setIsLoggingIn(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          { accessToken },
          { withCredentials: true }
        );
        if (data.success) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          setError(data.error || "Login failed");
        }
      } catch (e) {
        setError(e.response?.data?.error || "Network error");
      } finally {
        setIsLoggingIn(false);
      }
    },
    [navigate]
  );

  const exchangeCode = useCallback(
    async (code) => {
      try {
        setIsLoggingIn(true);
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
        setError(e.response?.data?.error || "Network error");
      } finally {
        setIsLoggingIn(false);
      }
    },
    [navigate]
  );

  // --------------------------------------------------------------
  //  FB callbacks
  // --------------------------------------------------------------
  const statusChangeCallback = useCallback(
    (response) => {
      console.log("statusChangeCallback →", response);
      if (response.status === "connected" && response.authResponse?.accessToken) {
        exchangeAccessToken(response.authResponse.accessToken);
      }
    },
    [exchangeAccessToken]
  );

  const fbLoginCallback = useCallback(
    (response) => {
      setIsLoggingIn(false);
      if (response.authResponse?.code) {
        exchangeCode(response.authResponse.code);
      } else {
        setError("Login cancelled or failed.");
      }
    },
    [exchangeCode]
  );

  // --------------------------------------------------------------
  //  Load FB SDK + XFBML + getLoginStatus
  // --------------------------------------------------------------
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) {
      if (window.FB) {
        setFbLoaded(true);
        window.FB.XFBML.parse();
        window.FB.getLoginStatus(statusChangeCallback);
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
      window.FB.XFBML.parse();
      window.FB.getLoginStatus(statusChangeCallback);
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
  }, [statusChangeCallback]);

  // --------------------------------------------------------------
  //  postMessage listener – ONLY parse real JSON
  // --------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (!e.origin.endsWith("facebook.com")) return;

      const payload = e.data;
      if (typeof payload !== "string") return;

      const trimmed = payload.trim();
      if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return;

      try {
        const data = JSON.parse(trimmed);
        if (data.type === "WA_EMBEDDED_SIGNUP" && data.code) {
          fbLoginCallback({ authResponse: { code: data.code } });
        }
      } catch {
        // ignore malformed messages
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [fbLoginCallback]);

  // --------------------------------------------------------------
  //  XFBML onlogin helper
  // --------------------------------------------------------------
  window.checkLoginState = () => {
    if (!window.FB) return setError("SDK not ready");
    setIsLoggingIn(true);
    window.FB.getLoginStatus(statusChangeCallback);
  };

  // --------------------------------------------------------------
  //  Manual fallback button
  // --------------------------------------------------------------
  const launchWhatsAppSignup = () => {
    if (!window.FB) return setError("SDK not ready");
    setIsLoggingIn(true);
    window.FB.login(
      fbLoginCallback,
      {
        config_id: import.meta.env.VITE_FACEBOOK_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "WHATSAPP",
          sessionInfoVersion: "3",
        },
      }
    );
  };

  // --------------------------------------------------------------
  //  Render
  // --------------------------------------------------------------
  const showFbButton = fbLoaded && !isLoggingIn;

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
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* XFBML BUTTON */}
              {showFbButton && (
                <div
                  className="fb-login-button"
                  data-size="large"
                  data-button-type="continue_with"
                  data-layout="rounded"
                  data-auto-logout-link="false"
                  data-use-continue-as="true"
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
                />
              )}

              <p className="text-sm text-gray-600 mt-4 mb-4">
                Use your Meta account to sign in.
              </p>

              {/* FALLBACK MANUAL BUTTON */}
              {fbLoaded && (
                <button
                  onClick={launchWhatsAppSignup}
                  disabled={isLoggingIn}
                  className="w-full bg-[#1877f2] text-white font-bold py-3 rounded-lg hover:bg-[#166fe5] flex items-center justify-center disabled:opacity-50"
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
                    "Continue with Facebook"
                  )}
                </button>
              )}
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
                        <CheckCircle className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
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
                    View setup guide <ArrowForward className="ml-1 text-sm" />
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