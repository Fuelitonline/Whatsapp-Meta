import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';

const WebHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);

    // Handle scroll for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderSticky(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation handler for Login
    const handleLogin = () => {
        navigate('/login');
    };

    // Smooth scroll for anchor links
    const handleSmoothScroll = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle navigation for Features and Pricing
    const handleSectionNavigation = (e, sectionId) => {
        e.preventDefault();
        if (location.pathname === '/') {
            // If on landing page, scroll to section
            handleSmoothScroll(e, sectionId);
        } else {
            // Navigate to landing page and scroll to section after navigation
            navigate('/');
            // Use setTimeout to ensure the page is loaded before scrolling
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${isHeaderSticky ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3">
                    <CheckCircle className="text-blue-600 text-3xl" />
                    <h1 className="text-2xl font-extrabold text-gray-900">FIO's WABM</h1>
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link
                        to="/"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={(e) => handleSectionNavigation(e, 'features')}
                    >
                        Features
                    </Link>
                    <Link
                        to="/"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={(e) => handleSectionNavigation(e, 'pricing')}
                    >
                        Pricing
                    </Link>
                    <Link
                        to="/help_center"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Help Center
                    </Link>
                    <Link
                        to="/support"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Support
                    </Link>
                    <button
                        onClick={handleLogin}
                        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Login
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default WebHeader;