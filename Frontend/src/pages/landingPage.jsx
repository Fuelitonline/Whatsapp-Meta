import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Facebook from '@mui/icons-material/Facebook';
import Twitter from '@mui/icons-material/Twitter';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    // Handle contact form input changes
    const handleContactInputChange = (e) => {
        const { name, value } = e.target;
        setContactForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle contact form submission
    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log('Contact Form Submitted:', contactForm);
        setContactForm({ name: '', email: '', message: '' });
        setIsContactModalOpen(false);
        alert('Thank you for your message! We will get back to you soon.');
    };

    // Navigation handlers
    const handleLogin = () => {
        navigate('/login');
    };

    // Smooth scroll for anchor links
    // (Removed unused handleSmoothScroll function)

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Header />
            {/* Hero Section */}
            <section className="pt-24 pb-20 bg-gradient-to-br from-blue-600 to-blue-300 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 text-center md:text-left animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Connect with Customers Seamlessly
                        </h1>
                        <p className="mt-4 text-lg sm:text-xl text-blue-100">
                            Leverage the WhatsApp Cloud API with FIO's WABM intuitive dashboard to engage customers effortlessly.
                        </p>
                    </div>
                    <div className="md:w-1/2 mt-10 md:mt-0 animate-fade-in-right">
                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                            alt="FIO's WABM Dashboard"
                            className="rounded-xl shadow-2xl object-cover w-full h-96 transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 animate-fade-in">Key Features</h2>
                    <p className="mt-4 text-xl text-center text-gray-600 animate-fade-in">
                        Everything you need to streamline your WhatsApp Business communications.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Connect WhatsApp',
                                desc: 'Link and manage your WhatsApp Business account effortlessly.',
                            },
                            {
                                title: 'Send Messages',
                                desc: 'Send template, text, media, and interactive messages to engage customers.',
                            },
                            {
                                title: 'Automate Conversations',
                                desc: 'Set up automated responses to streamline customer interactions.',
                            },
                            {
                                title: 'Webhook Integration',
                                desc: 'Enable real-time responses with seamless webhook integration.',
                            },
                            {
                                title: 'Monitor Usage',
                                desc: 'Track API usage and billing with a comprehensive dashboard.',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 animate-slide-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CheckCircle className="text-blue-600 text-5xl mx-auto" />
                                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                                <p className="mt-2 text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 animate-fade-in">How It Works</h2>
                    <p className="mt-4 text-xl text-center text-gray-600 animate-fade-in">
                        Get started in just a few simple steps.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                        {[
                            { step: 1, title: 'Login', desc: 'Sign in with your Meta account.' },
                            { step: 2, title: 'Connect WhatsApp', desc: 'Link your WhatsApp Business account.' },
                            { step: 3, title: 'Create Templates', desc: 'Design message templates for your customers.' },
                            { step: 4, title: 'Send Messages', desc: 'Engage with customers through various message types.' },
                            { step: 5, title: 'Monitor Results', desc: 'Track performance with analytics.' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="text-center p-4 animate-slide-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-center">
                                    <span className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
                                <p className="mt-2 text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Plans Section */}
            <section id="pricing" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 animate-fade-in">Pricing Plans</h2>
                    <p className="mt-4 text-xl text-center text-gray-600 animate-fade-in">
                        Choose the plan that suits your business needs.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                plan: 'Free',
                                price: '$0/month',
                                features: ['Basic WhatsApp API Access', 'Limited Message Volume', 'Basic Analytics', 'Email Support'],
                            },
                            {
                                plan: 'Pro',
                                price: '$49/month',
                                features: ['Full WhatsApp API Access', 'Higher Message Volume', 'Advanced Analytics', 'Priority Support'],
                            },
                            {
                                plan: 'Enterprise',
                                price: 'Custom',
                                features: ['Custom API Access', 'Unlimited Message Volume', 'Dedicated Support', 'Custom Integrations'],
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300 animate-slide-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <h3 className="text-2xl font-semibold text-gray-900">{item.plan}</h3>
                                <p className="mt-2 text-xl text-gray-600">{item.price}</p>
                                <ul className="mt-4 space-y-3 text-gray-600">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-center justify-center">
                                            <CheckCircle className="text-blue-600 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={handleLogin}
                                    className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Choose Plan
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 animate-fade-in">What Our Customers Say</h2>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'John Doe',
                                company: 'Tech Corp',
                                quote: 'This platform transformed how we engage with customers on WhatsApp!',
                            },
                            {
                                name: 'Jane Smith',
                                company: 'Retail Hub',
                                quote: 'The automation features saved us hours of manual work.',
                            },
                            {
                                name: 'Alex Brown',
                                company: 'Ecom Solutions',
                                quote: 'Seamless integration and excellent support!',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 animate-slide-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <p className="text-gray-600 italic">"{item.quote}"</p>
                                <p className="mt-4 text-gray-900 font-semibold">{item.name}</p>
                                <p className="text-gray-500">{item.company}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={contactForm.name}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={contactForm.email}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    placeholder="yourname@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    placeholder="Your message"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsContactModalOpen(false)}
                                    className="py-2 px-4 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />

            {/* Custom Tailwind Animations */}
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;