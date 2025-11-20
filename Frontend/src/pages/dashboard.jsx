// src/pages/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Landscape, Chat, Image, SmartButton, List, Webhook, Payments,
  Business, Api, ManageAccounts, Help, Edit, Forum, ArrowUpward,
  DataUsage, Info, Verified, WorkspacePremium, Send, Textsms,
  ArrowForward, Upgrade, ReceiptLong, CheckCircle, Smartphone, Logout
} from '@mui/icons-material';
import Sidebar from '../component/sidebar';
import Header from '../component/header';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      // Not logged in → redirect to login
      navigate('/login', { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      console.error("Failed to parse user data", err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading → safety redirect
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNavItem={activeNavItem}
        handleNavItemClick={handleNavItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          activeNavItem={activeNavItem}
          toggleSidebar={toggleSidebar}
          userDropdownOpen={userDropdownOpen}
          toggleUserDropdown={toggleUserDropdown}
          userName={user.name || user.businessName || 'User'}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#dde9f0] p-4 sm:p-6">
          {/* Business Profile Section */}
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-7 text-gray-900 sm:text-xl">
                  {user.businessName || user.name || 'My Business'}
                </h2>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Business className="mr-1.5 text-gray-400" style={{ fontSize: 18 }} />
                    WABA ID: {user.waBusinessAccountId || 'N/A'}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Smartphone className="mr-1.5 text-gray-400" style={{ fontSize: 18 }} />
                    Phone Number ID: {user.waPhoneNumberId || 'N/A'}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-1.5 text-green-500" style={{ fontSize: 18 }} />
                    API Connected
                  </div>
                </div>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Edit className="mr-2" style={{ fontSize: 18 }} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  <Logout className="mr-2" style={{ fontSize: 18 }} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Forum className="text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Messages Sent (Today)</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">142</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <ArrowUpward style={{ fontSize: 16 }} />
                          <span>12%</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <a href="/view_messages" className="font-medium text-blue-600 hover:text-blue-500">
                    View all messages →
                  </a>
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <DataUsage className="text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">API Usage</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">65%</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                          <Info style={{ fontSize: 16 }} />
                          <span>Monthly</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a href="/usage_analytics" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View usage analytics →
                </a>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <Verified className="text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Subscription Plan</dt>
                      <dd className="text-2xl font-semibold text-gray-900">Pro</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Upgrade plan →
                </a>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Payments className="text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Remaining Credits</dt>
                      <dd className="text-2xl font-semibold text-gray-900">7,850 <span className="text-sm text-gray-500">of 10,000</span></dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Buy more credits →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <button onClick={() => navigate('/create_template')} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <Landscape className="text-blue-600 mb-2" style={{ fontSize: 32 }} />
                <span className="text-sm font-medium">Create Template</span>
              </button>
              <button onClick={() => navigate('/message')} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <Send className="text-green-600 mb-2" style={{ fontSize: 32 }} />
                <span className="text-sm font-medium">Send Message</span>
              </button>
              <button onClick={() => navigate('/webhook')} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <Webhook className="text-purple-600 mb-2" style={{ fontSize: 32 }} />
                <span className="text-sm font-medium">Webhooks</span>
              </button>
              <button onClick={() => navigate('/create_flow')} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                <SmartButton className="text-indigo-600 mb-2" style={{ fontSize: 32 }} />
                <span className="text-sm font-medium">Automation Flows</span>
              </button>
            </div>
          </div>

          {/* Recent Activity + Billing */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-sm">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Textsms className="text-green-600" style={{ fontSize: 16 }} />
                  </span>
                  <div>
                    <p className="text-gray-900">Message sent to +91 98765 43210</p>
                    <p className="text-gray-500">2 minutes ago • Delivered</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3 text-sm">
                  <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Landscape className="text-yellow-600" style={{ fontSize: 16 }} />
                  </span>
                  <div>
                    <p className="text-gray-900">Template "Welcome Message" approved</p>
                    <p className="text-gray-500">1 hour ago</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Billing */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing & Subscription</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Billing</span>
                  <span className="font-medium">15 Dec 2025</span>
                </div>
                <div className="pt-3">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    <Upgrade className="inline mr-2" style={{ fontSize: 18 }} />
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;