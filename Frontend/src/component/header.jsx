import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from '@mui/icons-material';

const Header = ({ activeNavItem, toggleSidebar, userDropdownOpen, toggleUserDropdown }) => {
  // Fallback to 'create flow' if activeNavItem is undefined or not a string
  const navItemText = typeof activeNavItem === 'string' ? activeNavItem.replace('-', ' ') : 'Create Flow';

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleSidebar}
          >
            <Menu />
          </button>
          <h1 className="ml-2 md:ml-0 text-xl font-semibold text-[#255267] capitalize">
            {navItemText}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Search />
          </button>

          <div className="relative">
            <button
              className="flex items-center cursor-pointer focus:outline-none"
              onClick={toggleUserDropdown}
            >
              <div className="h-8 w-8 rounded-full bg-[#255267] flex items-center justify-center text-white">
                JD
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <Link to="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;