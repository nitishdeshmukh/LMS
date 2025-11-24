import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = '20 November 2025';

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'Name, email address, mobile number, educational qualifications, college/university name, and mailing address.',
        },
        {
          subtitle: 'Payment Information',
          text: 'When you purchase a course (e.g., the ₹500 enrollment fee), your credit/debit card information or UPI details are processed by our secure third-party payment gateways. We do not store your sensitive financial data on our servers.',
        },
        {
          subtitle: 'Project & Assessment Data',
          text: 'Assignments, code repositories, Capstone project submissions, and assessment scores required for certification.',
        },
        {
          subtitle: 'Usage Data',
          text: 'Information about how you interact with our Platform, including IP address, browser type, device information, and pages visited.',
        },
      ],
    },
    {
      id: 'information-usage',
      title: 'How We Use Your Information',
      content: [
        'To process your enrollment in streams such as Full Stack Web Development, Data Science, etc.',
        'To grant access to learning materials and track your progress towards certification.',
        'To verify your identity for the issuance of "Verified Certifications."',
        'To manage the "Campus Ambassador Program" and calculate rewards/referrals.',
        'To communicate regarding course updates, mentorship sessions, and support.',
        'To comply with legal obligations and resolve disputes.',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      text: 'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Platform.',
    },
    {
      id: 'disclosure',
      title: 'Disclosure of Information',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'With third-party vendors (e.g., payment processors, email services, cloud hosting) who assist in operating the Platform.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'If required by Indian law, court order, or government agency to disclose information for identity verification, or for the prevention, detection, or investigation of cyber incidents.',
        },
        {
          subtitle: 'Business Transfers',
          text: 'In connection with any merger, sale of company assets, or acquisition of all or a portion of our business by another company.',
        },
      ],
    },
    {
      id: 'security',
      title: 'Data Security',
      text: 'We implement appropriate technical and organizational security measures to protect your data from unauthorized access, misuse, loss, or alteration. Standard encryption protocols (SSL) are used for data transmission. However, no method of transmission over the internet is 100% secure.',
    },
    {
      id: 'user-rights',
      title: 'User Rights',
      text: 'You have the right to review the information you have provided and ensure that any personal information or sensitive personal data or information found to be inaccurate or deficient be corrected or amended as feasible.',
    },
  ];

  const grievanceOfficer = {
    name: 'Deepak Agrawal',
    email: 'info@code2dbug.com',
    phone: '9827563406',
    address: [
      'House No C-17,',
      'Behind 80 LIG Dhancha Bhawan,',
      'ACC Employees (2 labour) housing society,',
      'VTC: Kurud, District: Durg,',
      'State: Chhattisgarh, PIN Code: 490024',
    ],
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar className="w-5 h-5" />
            <p className="text-lg">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            Code2dbug, a proprietary of <span className="font-semibold">NAIR Solutions</span> ("we,"
            "our," or "us"), recognizes the importance of maintaining your privacy. We are committed
            to maintaining the confidentiality, integrity, and security of all information of our
            users. This Privacy Policy describes how we collect, store, handle, and transfer certain
            information of yours when you visit our website or use our mobile application
            (collectively, the "Platform").
          </p>
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy is published in compliance with{' '}
            <span className="font-semibold">
              Section 43A of the Information Technology Act, 2000
            </span>
            , and{' '}
            <span className="font-semibold">
              Rule 4 of the Information Technology (Reasonable Security Practices and Procedures and
              Sensitive Personal Data or Information) Rules, 2011
            </span>
            .
          </p>
        </div>

        {/* Dynamic Sections */}
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            className="bg-white rounded-lg shadow-md p-8 mb-8 scroll-mt-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                {index + 1}
              </span>
              {section.title}
            </h2>

            {section.text && <p className="text-gray-700 leading-relaxed">{section.text}</p>}

            {section.content && Array.isArray(section.content) && (
              <div className="space-y-4">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    {typeof item === 'string' ? (
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600" />
                        <p className="text-gray-700 leading-relaxed flex-1">{item}</p>
                      </div>
                    ) : (
                      <div className="pl-4 border-l-4 border-blue-600">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.subtitle}</h3>
                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Grievance Officer Section */}
        <div
          id="grievance-officer"
          className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 mb-8 border border-blue-200 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
              7
            </span>
            Grievance Officer
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            In accordance with the Information Technology Act, 2000, and Rules made thereunder, the
            name and contact details of the Grievance Officer are provided below:
          </p>

          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-lg">
                  {grievanceOfficer.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{grievanceOfficer.name}</p>
                <p className="text-sm text-gray-500">Grievance Redressal Officer</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <a
                href={`mailto:${grievanceOfficer.email}`}
                className="hover:text-blue-600 transition-colors underline"
              >
                {grievanceOfficer.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-blue-600 shrink-0" />
              <a
                href={`tel:+91${grievanceOfficer.phone}`}
                className="hover:text-blue-600 transition-colors"
              >
                +91 {grievanceOfficer.phone}
              </a>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
              <div>
                {grievanceOfficer.address.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Changes to Policy Section */}
        <div id="policy-changes" className="bg-white rounded-lg shadow-md p-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
              8
            </span>
            Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page.
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            If you have any questions about this Privacy Policy, please contact our Grievance
            Officer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
