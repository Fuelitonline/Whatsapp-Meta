import React, { useState } from 'react';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const HelpCenter = () => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', inquiryType: '', message: '' });
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    // Handle contact form input changes
    const handleContactInputChange = (e) => {
        const { name, value } = e.target;
        setContactForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle contact form submission
    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log('Help Center Inquiry Submitted:', contactForm);
        setContactForm({ name: '', email: '', inquiryType: '', message: '' });
        setIsContactModalOpen(false);
        alert('Thank you for your inquiry! Our support team will respond soon.');
    };

    // Toggle FAQ accordion
    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const faqs = [
        {
            question: 'How do I link my WhatsApp Business Account?',
            answer:
                'To link your WhatsApp Business Account, sign up or log in to FIO\'s WABM, navigate to the "Settings" section, and select "Connect WhatsApp." Follow the prompts to authenticate with your Meta account and provide your Phone Number ID and Access Token. Refer to our <a href="https://developers.facebook.com/docs/whatsapp/embedded-signup" class="text-blue-600 hover:text-blue-500">setup guide</a> for detailed steps.',
        },
        {
            question: 'How do I create a template?',
            answer:
                'In the dashboard, go to the "Templates" section and click "Create Template." Enter the template name, select the message type (text, media, or interactive), and customize the content. Submit the template for WhatsApp approval. Ensure your template complies with WhatsApp’s guidelines to avoid rejection.',
        },
        {
            question: 'Why was my template rejected?',
            answer:
                'Templates may be rejected if they violate WhatsApp’s Business Messaging Policies, such as containing promotional content, unclear language, or incorrect formatting. Check the rejection reason in the dashboard’s "Templates" section and revise accordingly. Visit WhatsApp’s <a href="https://developers.facebook.com/docs/whatsapp/message-template-guidelines" class="text-blue-600 hover:text-blue-500">guidelines</a> for more details.',
        },
        {
            question: 'What do message statuses mean?',
            answer:
                'Message statuses in the dashboard indicate the delivery state: "Sent" (message sent to WhatsApp API), "Delivered" (received by the user’s device), "Read" (viewed by the user), or "Failed" (delivery error). Check the "Analytics" section for detailed status logs and troubleshooting tips.',
        },
        {
            question: 'How do I set up a webhook?',
            answer:
                'To set up a webhook, go to the "Integrations" section in the dashboard and select "Webhooks." Enter your webhook URL, configure the events you want to receive (e.g., message delivery updates), and save. Ensure your server supports HTTPS and can handle WhatsApp’s webhook payloads. See our <a href="https://developers.facebook.com/docs/whatsapp/webhooks" class="text-blue-600 hover:text-blue-500">webhook documentation</a> for setup instructions.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Header />
            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in-up">Help Center</h1>
                    <p className="text-lg text-gray-600 mb-12 animate-fade-in-up">
                        Find answers to common questions or contact our support team for assistance.
                    </p>

                    {/* FAQ Section */}
                    <section id="faqs" className="mb-16 animate-slide-in">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                                        <span className="text-blue-600">{expandedFAQ === index ? '−' : '+'}</span>
                                    </div>
                                    {expandedFAQ === index && (
                                        <p
                                            className="mt-4 text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Support Section */}
                    <section id="contact-support" className="mb-16 animate-slide-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Support</h2>
                        <p className="text-gray-600 mb-6">
                            Can’t find the answer you’re looking for? Reach out to our support team.
                        </p>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
                        >
                            Contact Us
                        </button>
                    </section>
                </div>
            </main>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Support</h2>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="modal-name"
                                    name="name"
                                    value={contactForm.name}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="modal-email"
                                    name="email"
                                    value={contactForm.email}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    placeholder="yourname@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="modal-inquiryType" className="block text-sm font-medium text-gray-700">
                                    Inquiry Type
                                </label>
                                <select
                                    id="modal-inquiryType"
                                    name="inquiryType"
                                    value={contactForm.inquiryType}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    required
                                >
                                    <option value="" disabled>
                                        Select an inquiry type
                                    </option>
                                    <option value="account">Account Issues</option>
                                    <option value="billing">Billing Questions</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="modal-message"
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                                    placeholder="Describe your issue or question"
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
                                    Submit
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

export default HelpCenter;