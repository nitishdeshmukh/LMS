import React, { useState, useRef } from 'react';

const Loc = () => {
    const [copied, setCopied] = useState(false);
    const letterRef = useRef(null);

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0">


            {/* Main Letter Container - A4 Aspect Ratioish */}
            <div
                className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none print:w-full print:max-w-none"
                ref={letterRef}
            >
                {/* Decorative Top Border */}
                <div className="h-2 w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 print:bg-none print:border-b-4 print:border-cyan-600"></div>

                <div className="p-12 md:p-16 print:p-10 text-slate-800 leading-relaxed">

                    {/* Header Section */}
                    <header className="border-b border-slate-100 pb-8 mb-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase" style={{ fontFamily: 'Georgia, serif' }} >
                                Nair Solutions
                            </h1>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                                We code, We debug, We deliever
                            </p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                            <p>pravinrnair@nairsolutions.org</p>
                            <p> code2dbug.com</p>
                            <p> UDYAM-CG-05-0062143</p>
                            <p> 22DMOPP2753L</p>
                        </div>
                    </header>

                    {/* Salutation */}
                    <div className="mb-8">
                        <p className="text-lg font-medium text-slate-900 mb-6">To Whom It May Concern,</p>
                    </div>

                    {/* Body Content */}
                    <div className="space-y-6 text-justify text-slate-700">
                        <p>
                            It is with distinct pleasure and professional confidence that I write this letter of recommendation for
                            <span className="font-bold bg-yellow-50 px-1 mx-1 text-slate-900 border-b-2 border-yellow-200 outline-none" contentEditable suppressContentEditableWarning>
                                [Candidate Name]
                            </span>.
                            As the CEO of NAIR SOLUTIONS, I have had the unique opportunity to observe professional growth,
                            work ethic, and contributions at a strategic level, and I can attest that they are an individual of
                            exceptional caliber.
                        </p>

                        <p>
                            During their
                            <span className="bg-yellow-50 px-1 mx-1 border-b-2 border-yellow-200 outline-none" contentEditable suppressContentEditableWarning>
                                [Duration]
                            </span>
                            internship with our organization, where they successfully completed the
                            <span className="bg-yellow-50 px-1 mx-1 border-b-2 border-yellow-200 outline-none" contentEditable suppressContentEditableWarning>
                                [Course Name]
                            </span>
                            program,
                            <span className="bg-yellow-50 px-1 mx-1 border-b-2 border-yellow-200 outline-none" contentEditable suppressContentEditableWarning>
                                [Candidate Name]
                            </span>
                            consistently demonstrated a rare combination of technical acumen and emotional intelligence.
                            They possess an innate ability to navigate complex challenges with clarity and precision, often turning potential
                            obstacles into opportunities for innovation. Their approach to work is characterized by unwavering reliability
                            and a proactive mindset that sets a benchmark for their peers.
                        </p>

                        <p>
                            What stands out most, however, is their integrity and capacity for leadership. whether working independently
                            or collaborating within a diverse team, they maintain the highest standards of professional conduct.
                            They are not merely an employee who executes tasks; they are a thinker who adds value to the conceptualization
                            and execution of projects. Their adaptability allows them to thrive in dynamic, high-pressure environments
                            characteristic of today’s global market.
                        </p>

                        <p>
                            <span className="bg-yellow-50 px-1 mx-1 border-b-2 border-yellow-200 outline-none" contentEditable suppressContentEditableWarning>
                                [Candidate Name]
                            </span>
                            leaves NAIR SOLUTIONS with a spotless record and my highest endorsement. I am certain that they will
                            bring the same level of dedication, skill, and positive energy to your organization. They have my full support
                            in their future endeavors, and I am confident they will be a significant asset to any team they join.
                        </p>
                    </div>

                    {/* Closing */}
                    <div className="mt-12">
                        <p className="mb-8">Sincerely,</p>

                        <div className="mb-2">
                            {/* Simulated Signature */}
                            <img
                                src="/src/assets/signature.png"
                                alt="Authorized Signature"
                                className="h-16 mb-2 "
                            />
                        </div>

                        <div className="text-slate-900">
                            <p className="font-bold text-lg">Pravin R Nair</p>
                            <p className="font-medium text-slate-600">Chief Executive Officer</p>
                            <p className="font-medium text-slate-600">NAIR SOLUTIONS</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm text-slate-500">
                            <div>
                                <span className="block font-semibold text-cyan-600 uppercase text-xs tracking-wider mb-1">Contact</span>
                                info@code2dbug.com
                            </div>
                            <div>
                                <span className="block font-semibold text-cyan-600 uppercase text-xs tracking-wider mb-1">Verification ID</span>
                                NS-LOR-GEN-8820
                            </div>
                        </div>
                    </div>

                </div>

                {/* Decorative Bottom Border */}
                <div className="h-1 w-full bg-slate-100 print:hidden"></div>
            </div>

            {/* Global Styles for Print */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cedarville+Cursive&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white;
          }
          /* Hide non-printable elements */
          button, .print\\:hidden {
            display: none !important;
          }
          /* Remove background colors that might waste ink, keep borders/text */
          .bg-yellow-50 {
            background-color: transparent !important;
            border-bottom: none !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Loc;