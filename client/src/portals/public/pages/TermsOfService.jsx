import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Calendar, Scale, AlertTriangle, FileText } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = '20 November 2025';
  const [activeSection, setActiveSection] = useState('');

  // Smooth scroll to section
  const scrollToSection = id => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('data-section');
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tableOfContents = [
    { id: 'eligibility', title: 'Eligibility', icon: '1' },
    { id: 'services', title: 'Nature of Services', icon: '2' },
    { id: 'payments', title: 'Payments and Refunds', icon: '3' },
    { id: 'ambassador', title: 'Campus Ambassador Program', icon: '4' },
    { id: 'ip', title: 'Intellectual Property', icon: '5' },
    { id: 'conduct', title: 'User Conduct', icon: '6' },
    { id: 'liability', title: 'Limitation of Liability', icon: '7' },
    { id: 'governing', title: 'Governing Law & Disputes', icon: '8' },
    { id: 'contact', title: 'Contact Us', icon: '9' },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header Section */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Scale className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <div className="flex items-center gap-2 text-indigo-100">
            <Calendar className="w-5 h-5" />
            <p className="text-lg">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav
              className="sticky top-20 bg-zinc-900 rounded-lg shadow-md p-6"
              aria-label="Table of Contents"
            >
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-white">Contents</h2>
              </div>
              <ul className="space-y-2">
                {tableOfContents.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'bg-indigo-100 text-indigo-700 font-semibold'
                          : 'text-white hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                        {item.icon}
                      </span>
                       {item.title } 
                      
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Introduction */}
            <div className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-start gap-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg mb-6">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Please read these Terms of Service ("Terms", "Terms of Use") carefully before
                    using the Code2dbug website and services operated by NAIR Solutions ("us", "we",
                    or "our").
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using the Service, you agree to be bound by these Terms. If you
                disagree with any part of the terms, you may not access the Service.
              </p>
            </div>

            {/* Section 1: Eligibility */}
            <section
              id="eligibility"
              data-section="eligibility"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  1
                </span>
                Eligibility
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To use our Services, you must be at least{' '}
                <span className="font-semibold">18 years old</span> or have the consent of a parent
                or guardian. By using the Platform, you represent that you are physically in India
                or comply with the local laws of your jurisdiction regarding online conduct.
              </p>
            </section>

            {/* Section 2: Nature of Services */}
            <section
              id="services"
              data-section="services"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  2
                </span>
                Nature of Services
              </h2>
              <div className="space-y-6">
                <div className="pl-4 border-l-4 border-indigo-600">
                  <h3 className="font-semibold text-gray-100 mb-2">Educational Content</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The Platform offers self-paced, internship-based learning modules in various
                    technical streams (e.g., Web Development, Data Science).
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-gray-100 mb-2">Not an Employment Guarantee</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The term "Internship-Based Learning" refers to the methodology of learning
                    through practical tasks. Completion of the course or Capstone project does not
                    guarantee employment with us or any third-party company unless explicitly stated
                    in a separate written agreement.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-green-600">
                  <h3 className="font-semibold text-gray-100 mb-2">Certification</h3>
                  <p className="text-gray-300 leading-relaxed">
                    "Verified Certifications" are awarded solely upon the successful completion of
                    mandatory projects and assessments. Paying the enrollment fee does not guarantee
                    a certificate; academic standards must be met.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Payments and Refunds */}
            <section
              id="payments"
              data-section="payments"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  3
                </span>
                Payments and Refunds
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-100">Pricing:</span>
                    <span className="text-gray-300">
                      {' '}
                      Programs are priced as displayed on the website. Prices are subject to change
                      without prior notice.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-100">Payment Processing:</span>
                    <span className="text-gray-300">
                      {' '}
                      All payments are processed through third-party gateways. You agree to provide
                      accurate billing information.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-100">Refund Policy:</span>
                    <span className="text-gray-300">
                      {' '}
                      Due to the digital nature of the content and immediate access to intellectual
                      property, fees once paid are non-refundable, except where explicitly required
                      by law.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Campus Ambassador Program */}
            <section
              id="ambassador"
              data-section="ambassador"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  4
                </span>
                Campus Ambassador Program
              </h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-4 border-indigo-600">
                  <h3 className="font-semibold text-gray-100 mb-2">Role</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Users participating in the Campus Ambassador Program act as independent
                    advocates and not employees or agents of the Company.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-indigo-600">
                  <h3 className="font-semibold text-gray-100 mb-2">Rewards</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Rewards and earnings are performance-based. We reserve the right to modify the
                    reward structure or terminate a user's ambassador status for fraudulent activity
                    or misrepresentation of the brand.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Intellectual Property */}
            <section
              id="ip"
              data-section="ip"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  5
                </span>
                Intellectual Property
              </h2>
              <p className="text-gray-300 leading-relaxed">
                The Service and its original content (including videos, code skeletons, text,
                graphics, and logos) are and will remain the exclusive property of{' '}
                <span className="font-semibold">NAIR Solutions</span>. The content is protected by
                copyright, trademark, and other laws of both India and foreign countries. You may
                not reproduce, distribute, or create derivative works from our content without
                express written permission.
              </p>
            </section>

            {/* Section 6: User Conduct */}
            <section
              id="conduct"
              data-section="conduct"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  6
                </span>
                User Conduct
              </h2>
              <p className="text-gray-100 leading-relaxed mb-4">You agree not to :</p>
              <div className="space-y-3 text-gray-300 ">
                {[
                  'Share your account credentials with others.',
                  'Upload malicious code, viruses, or harmful data to the Platform.',
                  'Engage in plagiarism regarding your Capstone Project or assessments.',
                  'Harass mentors, staff, or other students.',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-red-600" />
                    <p className="text-gray-300 leading-relaxed flex-1">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section
              id="liability"
              data-section="liability"
              className="bg-zinc-800 rounded-lg shadow-md p-8 mb-8 border border-zinc-800 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold">
                  7
                </span>
                 <span className='text-white' > Limitation of Liability </span> 
              </h2>
              <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  To the maximum extent permitted by applicable law, in no event shall{' '}
                  <span className="font-semibold">Code2dbug, a proprietary of NAIR Solutions</span>{' '}
                  be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or
                  other intangible losses, resulting from your access to or use of or inability to
                  access or use the Service.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our total liability to you for any claim arising out of or relating to these Terms
                  or the Service is limited to the amount you paid us to use the Service (e.g.,
                  ₹500).
                </p>
              </div>
            </section>

            {/* Section 8: Governing Law */}
            <section
              id="governing"
              data-section="governing"
              className="bg-zinc-900 rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  8
                </span>
                Governing Law and Dispute Resolution
              </h2>
              <div className="space-y-4">
                <div className="pl-4 border-l-4 border-indigo-600">
                  <h3 className="font-semibold text-gray-100 mb-2">Governing Law</h3>
                  <p className="text-gray-300 leading-relaxed">
                    These Terms shall be governed and construed in accordance with the{' '}
                    <span className="font-semibold">laws of India</span>.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-indigo-600">
                  <h3 className="font-semibold text-gray-100 mb-2">Jurisdiction</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Any dispute arising out of or in connection with these Terms, including any
                    question regarding its existence, validity, or termination, shall be subject to
                    the exclusive jurisdiction of the courts located in{' '}
                    <span className="font-semibold">Durg, India</span>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Contact Us */}
            <section
              id="contact"
              data-section="contact"
              className="bg-zinc-800 rounded-lg shadow-md p-8 border border-blue-200 scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">
                  9
                </span>
                Contact Us
              </h2>
              <p className="text-gray-100 leading-relaxed mb-6">
                If you have any questions about these Terms, please contact us at:
              </p>

              <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                  <a
                    href="mailto:info@code2dbug.com"
                    className="hover:text-indigo-600 transition-colors underline"
                  >
                    info@code2dbug.com
                  </a>
                </div>

                <div className="flex items-start gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                  <div>
                    <p>House No C-17,</p>
                    <p>Behind 80 LIG Dhancha Bhawan,</p>
                    <p>ACC Employees (2 labour) housing society,</p>
                    <p>VTC: Kurud, District: Durg,</p>
                    <p>State: Chhattisgarh, PIN Code: 490024</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Acceptance Footer */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg p-8 text-center mt-10">
              <p className="text-lg font-semibold mb-2">
                By using Code2dbug, you acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service.
              </p>
              <p className="text-indigo-200 text-sm">Last updated on {lastUpdated}</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
