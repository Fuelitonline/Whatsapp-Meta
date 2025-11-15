import React from 'react';
import { Link } from 'react-router-dom';
import Facebook from '@mui/icons-material/Facebook';
import Twitter from '@mui/icons-material/Twitter';
import LinkedIn from '@mui/icons-material/LinkedIn';

const webFooter = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold">FIO's WABM</h3>
                        <p className="mt-4 text-gray-400">
                            Empowering businesses to connect with customers through WhatsApp.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link to="/privacy_policy" className="text-gray-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms_of_service" className="text-gray-400 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/help_center" className="text-gray-400 hover:text-white transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Connect</h3>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <LinkedIn />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center">
                    <p className="text-gray-400">© 2025 FIO's WABM. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default webFooter;