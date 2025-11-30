// CustomCertificate.jsx
import React from 'react';
import certificateBG from "../../../assets/images/Certificatebackground.png";
import signature from '../../../assets/images/signature.png';

import { Mail, Globe, FileText, Building2, MapPin } from 'lucide-react';

const CustomCertificate = ({
    // Student/Certificate Data - DYNAMIC
    studentName = "John Doe",
    course = "Full Stack Development",
    timeperiod = "3 months",
    conductedFrom = "1st August - 31th October, 2025",
    
    // Company Data
    ceoName = "PRAVIN.R.NAIR",
    ceoTitle = "Company CEO",
    email = "pravinrnair@nairsolutions.org",
    website = "www.code2dbug.com",
    regNo = "UDYAM-CG-05-0062143",
    gstin = "22DMOPP2753L",
    address = "Shop No - 17, Govind 8D LIG shanchna bhawan ACC Employees ( 2 labour) complex, G.T. Road, Kadol PO: Kurud City: Bhilai, District: Durg State: Chhattisgarh"
}) => {
    return (
        // Dark Blue Background Container
        <div className="relative w-full min-h-screen bg-[#243d5c] flex items-center justify-center p-14">

            {/* Certificate Container */}
            <div className="relative">

                {/* Background Image */}
                <img src={certificateBG} alt="" className="w-full h-auto" />

                {/* Text Content Overlay - Positioned Above Image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-16 py-8">
                    <div className="text-center space-y-1 w-full">

                        {/* Logo */}
                        <div className="mb-1">
                            <div className="relative inline-block">
                                <span className="text-[42px] font-bold text-[#243d5c]" style={{ fontFamily: 'Georgia, serif' }}>
                                    NS
                                </span>
                            </div>
                            <p className="text-[11px] text-[#243d5c] font-semibold tracking-[0.25em] mt-1">
                                N.A.I.R.SOLUTIONS
                            </p>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-[68px] font-bold text-[#243d5c] tracking-[0.15em] leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                            CERTIFICATE
                        </h1>

                        <h2 className="text-[20px] font-medium text-[#243d5c] tracking-[0.35em] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                            OF ACHIEVEMENT
                        </h2>

                        {/* Presented To */}
                        <p className="text-[20px] font-semibold text-[#243d5c] tracking-[0.2em]">
                            THIS CERTIFICATE IS PRESENTED TO
                        </p>

                        {/* Name - DYNAMIC */}
                        <h3 className="text-[52px] text-[#d4a574] py-3" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                            {studentName}
                        </h3>

                        {/* From */}
                        <p className="text-[17px] text-[#243d5c]">
                            From <span className="font-bold">CODE2DBUG</span>
                        </p>

                        {/* Description - DYNAMIC COURSE & TIME PERIOD */}
                        <p className="text-[17px] text-[#243d5c] leading-relaxed max-w-[650px] mx-auto">
                            In recognition of his/her efforts and achievement in completing the <span className="font-semibold">{course}</span>
                            <br />
                            <span className="font-semibold">{timeperiod}</span> internship program.
                        </p>

                        {/* Conducted From - DYNAMIC DATE */}
                        <p className="text-[17px] font-semibold text-[#243d5c] pt-3">
                            Conducted From <span className="font-bold">{conductedFrom}</span>
                        </p>
                    </div>
                    
                    <div className='flex justify-between w-full mt-10'>
                        {/* Company Dossier */}
                        <div className="text-left text-[#000000] max-w-[280px]">
                            <h3 className="font-bold text-[11px] mb-3 pb-1 border-b-2 border-[#000000] tracking-wide">
                                OFFICIAL COMPANY DOSSIER
                            </h3>

                            <div className="space-y-1.5">
                                {/* Email */}
                                <div className="flex items-start gap-2">
                                    <Mail className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-[9px] leading-relaxed">
                                        <span className="font-semibold">Email:</span> [{email}]
                                    </p>
                                </div>

                                {/* Website */}
                                <div className="flex items-start gap-2">
                                    <Globe className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-[9px] leading-relaxed">
                                        <span className="font-semibold">Website:</span> [{website}]
                                    </p>
                                </div>

                                {/* Registration Number */}
                                <div className="flex items-start gap-2">
                                    <FileText className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-[9px] leading-relaxed">
                                        <span className="font-semibold">Reg. No:</span> [{regNo}]
                                    </p>
                                </div>

                                {/* GSTIN */}
                                <div className="flex items-start gap-2">
                                    <Building2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-[9px] leading-relaxed">
                                        <span className="font-semibold">GSTIN:</span> [ {gstin} ]
                                    </p>
                                </div>

                                {/* Registered Address */}
                                <div className="flex items-start gap-2 mt-2">
                                    <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-[7.5px] leading-tight">
                                        <span className="font-semibold">Regd.Address:</span> {address}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Signature Section */}
                        <div className="text-right max-w-[220px]">
                            {/* Signature Image */}
                            <div className="mb-2">
                                <img
                                    src={signature}
                                    alt="Signature"
                                    className="w-full h-auto max-h-[120px] object-contain"
                                />
                            </div>

                            {/* Divider Line */}
                            <div className="border-t-2 border-[#243d5c] mb-2"></div>

                            {/* CEO Name */}
                            <p className="text-[13px] font-bold text-[#243d5c] tracking-wide leading-tight">
                                {ceoName}
                            </p>

                            {/* CEO Title */}
                            <p className="text-[11px] text-[#243d5c] mt-1">
                                {ceoTitle}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomCertificate;
