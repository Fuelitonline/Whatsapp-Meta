import React, { useState } from 'react';
import CheckCircle from '@mui/icons-material/CheckCircle';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Header from '../component/webHeader';
import Footer from '../component/webFooter';

const SupportPage = () => {
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', issueType: '', description: '' });
  const [expandedIssue, setExpandedIssue] = useState(null);

  // Handle ticket form input changes
  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle ticket form submission
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    console.log('Support Ticket Submitted:', ticketForm);
    setTicketForm({ name: '', email: '', issueType: '', description: '' });
    alert('Your support ticket has been submitted! You will receive a confirmation email soon.');
  };

  // Toggle common issues accordion
  const toggleIssue = (index) => {
    setExpandedIssue(expandedIssue === index ? null : index);
  };

  const commonIssues = [
    {
      issue: 'Template Approval Delays',
      solution:
        'Template approvals typically take 24-48 hours. Ensure your template complies with WhatsApp’s <a href="https://developers.facebook.com/docs/whatsapp/message-template-guidelines" class="text-blue-600 hover:text-blue-500">Message Template Guidelines</a>. Check the "Templates" section in the dashboard for rejection reasons and resubmit with corrections.',
    },
    {
      issue: 'API Credential Errors',
      solution:
        'Verify that your Phone Number ID and Access Token are correct in the "Settings" section. Regenerate your Access Token in the Meta Business Manager if needed. Refer to our <a href="https://developers.facebook.com/docs/whatsapp/embedded-signup" class="text-blue-600 hover:text-blue-500">setup guide</a> for assistance.',
    },
    {
      issue: 'Webhook Setup Problems',
      solution:
        'Ensure your webhook URL uses HTTPS and is publicly accessible. Test your endpoint with WhatsApp’s webhook test tool in the dashboard. Check our <a href="https://developers.facebook.com/docs/whatsapp/webhooks" class="text-blue-600 hover:text-blue-500">webhook documentation</a> for configuration details.',
    },
    {
      issue: 'Message Delivery Troubleshooting',
      solution:
        'Check message statuses in the "Analytics" section. Common issues include invalid recipient numbers, WhatsApp API downtime, or rate limits. Ensure the recipient has opted in and your account is in good standing. Contact support if issues persist.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in-up">Support</h1>
          <p className="text-lg text-gray-600 mb-12 animate-fade-in-up">
            We’re here to help you with any issues or questions. Submit a support ticket or explore common issues below.
          </p>

          {/* Submit a Ticket Section */}
          <section id="submit-ticket" className="mb-16 animate-slide-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Submit a Support Ticket</h2>
            <p className="text-gray-600 mb-6">
              Need assistance? Submit a ticket, and our support team will get back to you promptly.
            </p>
            <form onSubmit={handleTicketSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={ticketForm.name}
                  onChange={handleTicketInputChange}
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
                  value={ticketForm.email}
                  onChange={handleTicketInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                  placeholder="yourname@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">
                  Issue Type
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={ticketForm.issueType}
                  onChange={handleTicketInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                  required
                >
                  <option value="" disabled>
                    Select an issue type
                  </option>
                  <option value="account">Account Issues</option>
                  <option value="billing">Billing Issues</option>
                  <option value="technical">Technical Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Issue Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={ticketForm.description}
                  onChange={handleTicketInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
                  placeholder="Describe your issue in detail"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </section>

          {/* Common Issues Section */}
          <section id="common-issues" className="mb-16 animate-slide-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Common Issues</h2>
            <p className="text-gray-600 mb-6">
              Explore solutions to frequently encountered issues.
            </p>
            <div className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
                  onClick={() => toggleIssue(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">{issue.issue}</h3>
                    <span className="text-blue-600">{expandedIssue === index ? '−' : '+'}</span>
                  </div>
                  {expandedIssue === index && (
                    <p
                      className="mt-4 text-gray-600"
                      dangerouslySetInnerHTML={{ __html: issue.solution }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

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
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SupportPage;