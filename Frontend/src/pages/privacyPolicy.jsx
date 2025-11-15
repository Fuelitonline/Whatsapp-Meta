import React, { useState } from 'react';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const PrivacyPolicy = () => {
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
        console.log('Privacy Inquiry Submitted:', contactForm);
        setContactForm({ name: '', email: '', message: '' });
        setIsContactModalOpen(false);
        alert('Thank you for your inquiry! We will respond soon.');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in-up">Privacy Policy</h1>
                    <p className="text-lg text-gray-600 mb-12 animate-fade-in-up">
                        At FIO's WABM, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, store, and protect your data, as well as your rights regarding your information.
                    </p>

                    {/* Section 1: Information We Collect */}
                    <section id="information-collected" className="mb-12 animate-slide-in">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600">
                            We collect the following types of information to provide and improve our services:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Business Information:</strong> Business Name, Email Address, and Phone Number provided during registration.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>WhatsApp API Credentials:</strong> Phone Number ID and Access Token to enable WhatsApp Business API functionality.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Usage Data:</strong> Information about messages sent, templates created, and interactions with the platform.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Analytics Data:</strong> Aggregated data on API usage and dashboard interactions to improve our services.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 2: How We Use Your Information */}
                    <section id="use-of-information" className="mb-12 animate-slide-in" style={{ animationDelay: '100ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-600">
                            We use the collected information to:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Provide and maintain the functionality of FIO's WABM, including WhatsApp API integration.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Process payments and manage subscriptions for paid plans.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Send notifications and updates related to your account or service changes.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Analyze usage patterns to improve our platform and user experience.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 3: Data Sharing */}
                    <section id="data-sharing" className="mb-12 animate-slide-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Sharing</h2>
                        <p className="text-gray-600">
                            We do not sell or rent your personal information. We may share your information:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>With Meta:</strong> To enable WhatsApp Cloud API functionality, we share necessary credentials with Meta’s servers.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>With Service Providers:</strong> We may share data with trusted third-party providers for payment processing, analytics, or customer support.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>For Legal Reasons:</strong> If required by law or to protect our rights, we may disclose your information to comply with legal obligations.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4: Data Security */}
                    <section id="data-security" className="mb-12 animate-slide-in" style={{ animationDelay: '300ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="text-gray-600">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Encryption of sensitive data, such as WhatsApp API credentials, both in transit and at rest.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Regular security audits and updates to our platform.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Access controls to ensure only authorized personnel can access your data.</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-gray-600">
                            Despite our efforts, no online platform is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                    </section>

                    {/* Section 5: Your Rights */}
                    <section id="your-rights" className="mb-12 animate-slide-in" style={{ animationDelay: '400ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                        <p className="text-gray-600">
                            Depending on your jurisdiction, you may have the following rights regarding your personal information:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Access:</strong> Request a copy of the personal information we hold about you.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Correction:</strong> Request corrections to inaccurate or incomplete data.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Deletion:</strong> Request deletion of your data, subject to legal or contractual obligations.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span><strong>Opt-Out:</strong> Opt out of non-essential communications, such as marketing emails.</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-gray-600">
                            To exercise these rights, contact us at{' '}
                            <a href="mailto:support@fioswabm.com" className="text-blue-600 hover:text-blue-500">
                                support@fioswabm.com
                            </a>{' '}
                            or use the contact form below.
                        </p>
                    </section>

                    {/* Section 6: Cookies and Tracking */}
                    <section id="cookies-tracking" className="mb-12 animate-slide-in" style={{ animationDelay: '500ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                        <p className="text-gray-600">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Authenticate users and maintain session data.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Analyze website performance and user behavior.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Provide personalized content and advertisements (optional).</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-gray-600">
                            You can manage cookie preferences through your browser settings. Disabling cookies may affect your experience on our platform.
                        </p>
                    </section>

                    {/* Section 7: Third-Party Links */}
                    <section id="third-party-links" className="mb-12 animate-slide-in" style={{ animationDelay: '600ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Links</h2>
                        <p className="text-gray-600">
                            Our platform may contain links to third-party websites, such as Meta’s WhatsApp documentation. We are not responsible for the privacy practices or content of these websites. Please review their privacy policies.
                        </p>
                    </section>

                    {/* Section 8: Data Retention */}
                    <section id="data-retention" className="mb-12 animate-slide-in" style={{ animationDelay: '700ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
                        <p className="text-gray-600">
                            We retain your personal information only as long as necessary to:
                        </p>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Provide our services and fulfill our contractual obligations.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="text-blue-600 mr-2 mt-1" />
                                <span>Comply with legal requirements, such as tax or regulatory obligations.</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-gray-600">
                            You can request data deletion through your account settings or by contacting us.
                        </p>
                    </section>

                    {/* Section 9: Changes to This Privacy Policy */}
                    <section id="policy-changes" className="mb-12 animate-slide-in" style={{ animationDelay: '800ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
                        <p className="text-gray-600">
                            We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through the platform. The updated policy will be effective upon posting.
                        </p>
                    </section>

                    {/* Section 10: Contact Information */}
                    <section id="contact-info" className="mb-12 animate-slide-in" style={{ animationDelay: '900ms' }}>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-600">
                            For questions or concerns about this Privacy Policy, please contact us:
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Inquiry</h2>
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
                                    placeholder="Your privacy-related inquiry"
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

export default PrivacyPolicy;