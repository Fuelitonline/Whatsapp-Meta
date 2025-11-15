import React, { useState } from 'react';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const TermsOfService = () => {
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
        console.log('Terms of Service Inquiry Submitted:', contactForm);
        setContactForm({ name: '', email: '', message: '' });
        setIsContactModalOpen(false);
        alert('Thank you for your inquiry! We will respond soon.');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in-up">Terms of Service</h1>
                    <p className="text-lg text-gray-600 mb-12 animate-fade-in-up">
                        These Terms of Service ("Terms") govern your use of FIO's WABM. By accessing or using our platform, you agree to be bound by these Terms. Please read them carefully.
                    </p>

                    {/* Section 1: Acceptance of Terms */}
                    <section id="acceptance" className="mb-12 animate-slide-in">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600">
                            By accessing or using FIO's WABM, you agree to comply with and be bound by these Terms, our Privacy Policy, and any applicable laws. If you do not agree, you must not use our platform.
                        </p>
                    </section>

                    {/* Section 2: Description of Service */}
                    <section id="service-description" className="mb-12 animate-slide-in" style={{ animationDelay: '100ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="text-gray-600">
                            FIO's WABM is a dashboard that enables businesses to manage their WhatsApp Cloud API interactions. Our platform allows you to:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Connect and manage your WhatsApp Business account.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Send template, text, media, and interactive messages.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Automate customer conversations and set up webhooks.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Monitor API usage, billing, and analytics.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3: Account Responsibilities */}
                    <section id="account-responsibilities" className="mb-12 animate-slide-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Responsibilities</h2>
                        <p className="text-gray-600">
                            To use our platform, you must:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Provide Accurate Information:</strong> Submit true and accurate information during registration, including Business Name, Email, and Phone Number.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Secure Credentials:</strong> Safeguard your WhatsApp API credentials (Phone Number ID, Access Token) and login details. You are responsible for any activity under your account.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4: Restrictions */}
                    <section id="restrictions" className="mb-12 animate-slide-in" style={{ animationDelay: '300ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Restrictions</h2>
                        <p className="text-gray-600">
                            You agree not to:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Send spam or unsolicited messages through our platform.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Transmit illegal, harmful, or offensive content via WhatsApp.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Violate WhatsApp’s policies, including the WhatsApp Business API guidelines.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 5: Service Availability */}
                    <section id="service-availability" className="mb-12 animate-slide-in" style={{ animationDelay: '400ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Availability</h2>
                        <p className="text-gray-600">
                            While we strive to provide a reliable service:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>We do not guarantee 100% uptime or uninterrupted access.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>We may perform scheduled maintenance, which may temporarily affect service availability.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 6: Payment and Subscriptions */}
                    <section id="payment-subscriptions" className="mb-12 animate-slide-in" style={{ animationDelay: '500ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment and Subscriptions</h2>
                        <p className="text-gray-600">
                            For users on paid plans:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Billing Cycle:</strong> Subscriptions are billed monthly or annually, as selected during signup.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Refund Policy:</strong> Refunds are available within 14 days of purchase, subject to our refund policy.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Upgrades/Downgrades:</strong> You may upgrade or downgrade your plan at any time, with changes reflected in the next billing cycle.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 7: Termination */}
                    <section id="termination" className="mb-12 animate-slide-in" style={{ animationDelay: '600ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
                        <p className="text-gray-600">
                            We reserve the right to:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Terminate or suspend accounts that violate these Terms or WhatsApp’s policies.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Allow users to delete their accounts at any time through the platform settings.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 8: Limitation of Liability */}
                    <section id="liability" className="mb-12 animate-slide-in" style={{ animationDelay: '700ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <p className="text-gray-600">
                            To the fullest extent permitted by law, FIO's WABM is not liable for:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Failures in message delivery caused by WhatsApp API or network issues.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Downtime or interruptions in the WhatsApp Cloud API service.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Any indirect, incidental, or consequential damages arising from your use of the platform.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 9: Governing Law */}
                    <section id="governing-law" className="mb-12 animate-slide-in" style={{ animationDelay: '800ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
                        <p className="text-gray-600">
                            These Terms are governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles.
                        </p>
                    </section>

                    {/* Section 10: Contact Info */}
                    <section id="contact-info" className="mb-12 animate-slide-in" style={{ animationDelay: '900ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-600">
                            For questions or concerns about these Terms, please contact us:
                        </p>
                        <p className="mt-4 text-gray-600">
                            <strong>Email:</strong>{' '}
                            <a href="mailto:support@fioswabm.com" className="text-blue-600 hover:text-blue-500">
                                support@fioswabm.com
                            </a>
                        </p>
                        <p className="mt-2 text-gray-600">
                            Alternatively, use our{' '}
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="text-blue-600 hover:text-blue-500 underline"
                            >
                                contact form
                            </button>{' '}
                            to reach out.
                        </p>
                    </section>
                </div>
            </main>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service Inquiry</h2>
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
                                    placeholder="Your terms-related inquiry"
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

export default TermsOfService;