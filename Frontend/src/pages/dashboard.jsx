// dashboard.jsx
import React, { useState } from 'react';
import {
  Landscape,
  Chat,
  Image,
  SmartButton,
  List,
  Webhook,
  Payments,
  Business,
  Api,
  ManageAccounts,
  Help,
  Edit,
  Forum,
  ArrowUpward,
  DataUsage,
  Info,
  Verified,
  WorkspacePremium,
  Send,
  Textsms,
  ArrowForward,
  Upgrade,
  ReceiptLong,
  CheckCircle,
  Smartphone
} from '@mui/icons-material';
import Sidebar from '../component/sidebar'; // Import Sidebar component
import Header from '../component/header'; // Import Header component

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

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
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#dde9f0] p-4 sm:p-6">
          {/* Business Profile Section */}
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-7 text-gray-900 sm:text-xl sm:truncate">Acme Corporation</h2>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Landscape className="mr-1.5 text-gray-400" sx={{ fontSize: 18 }} />
                    WhatsApp ID: 123456789
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Smartphone className="mr-1.5 text-gray-400" sx={{ fontSize: 18 }} />
                    Phone ID: +1 (555) 123-4567
                  </div>
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-1.5 text-green-500" sx={{ fontSize: 18 }} />
                    API Connected
                  </div>
                </div>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  <Edit className="mr-2" sx={{ fontSize: 18 }} />
                  Edit Profile
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
                          <ArrowUpward className="text-green-500" sx={{ fontSize: 16 }} />
                          <span>12%</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    View details
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
                          <Info className="text-yellow-500" sx={{ fontSize: 16 }} />
                          <span>Monthly</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    View usage details
                  </a>
                </div>
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
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">Pro</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                          <WorkspacePremium className="text-blue-500" sx={{ fontSize: 16 }} />
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Upgrade plan
                  </a>
                </div>
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
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">7,850</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-600">
                          <span>of 10,000</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Buy more credits
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Landscape className="text-blue-600 mb-2" sx={{ fontSize: 32 }} />
                <span className="text-sm font-medium text-gray-700">Create Template</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Send className="text-green-600 mb-2" sx={{ fontSize: 32 }} />
                <span className="text-sm font-medium text-gray-700">Send Message</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Webhook className="text-purple-600 mb-2" sx={{ fontSize: 32 }} />
                <span className="text-sm font-medium text-gray-700">Setup Webhooks</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Landscape className="text-indigo-600 mb-2" sx={{ fontSize: 32 }} />
                <span className="text-sm font-medium text-gray-700">Automation Flows</span>
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                          <Textsms className="text-green-600" sx={{ fontSize: 16 }} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Text message sent to +1 (555) 987-6543
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Delivered</span>
                          <span className="ml-2">2 minutes ago</span>
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                          <Landscape className="text-blue-600" sx={{ fontSize: 16 }} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          New template "Order Confirmation" submitted
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Pending Review</span>
                          <span className="ml-2">1 hour ago</span>
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
                          <Webhook className="text-purple-600" sx={{ fontSize: 16 }} />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Webhook received: Message status update
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="ml-2">3 hours ago</span>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="mt-4">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    View all activity <ArrowForward className="align-text-bottom" sx={{ fontSize: 16 }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Billing & Subscription */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Billing & Subscription</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Pro Plan</h4>
                    <p className="text-sm text-gray-500">Up to 100,000 messages/month</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <div className="py-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Billing Period</span>
                    <span className="font-medium text-gray-900">Monthly</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Next Payment</span>
                    <span className="font-medium text-gray-900">June 15, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium text-gray-900">$99.00</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                  <button className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mb-3 sm:mb-0">
                    <Upgrade className="mr-2" sx={{ fontSize: 18 }} />
                    Upgrade Plan
                  </button>
                  <a href="#" className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <ReceiptLong className="mr-2" sx={{ fontSize: 18 }} />
                    View Payment History
                  </a>
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