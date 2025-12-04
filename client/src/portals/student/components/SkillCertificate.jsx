import React from 'react';

const SkillCertificate = ({
    studentName = "Deepak Agrawal",
    courseName = "Data Science, Machine Learning & Artificial Intelligence",
    duration = "60 days",
    issuedBy = "NAIR SOLUTIONS",
    platform = "Code2Dbug.com",
    certificateId = "CERT2025001",

    // Company Data
    ceoName = "PRAVIN.R.NAIR",
    ceoTitle = "Company CEO",
    email = "pravinrnair@nairsolutions.org",
    website = "www.code2dbug.com",
    regNo = "UDYAM-CG-05-0062143",
    gstin = "22DMOPP2753L",
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
            <div className="relative w-full max-w-4xl bg-white border-[16px] border-yellow-600 shadow-2xl">
                {/* Header with Logos */}
                <div className="flex items-center justify-between px-12 pt-8 pb-6">
                    <div className="flex flex-col items-center">
                        <img
                            src="/src/assets/msmelogo.png"
                            alt="MSME Logo"
                            className="h-16 mb-2"
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-lg">
                        <h1 className="text-5xl font-bold text-[#2c3e50] mb-2 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                            NS
                        </h1>
                        <p className="text-sm text-[#2c3e50] tracking-[0.3em] font-medium">
                            N.A.I.R.SOLUTIONS
                        </p>
                    </div>
                </div>

                {/* Certificate Content */}
                <div className="px-12 py-8">
                    <h1 className="text-4xl font-bold text-center mb-8 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                        SKILL CERTIFICATE
                    </h1>

                    <div className="text-center space-y-4">
                        <p className="text-lg">This is to certify that</p>

                        <h2 className="text-3xl font-bold my-4" style={{ fontFamily: 'Georgia, serif' }}  >
                            {studentName}
                        </h2>

                        <p className="text-lg">
                            has successfully completed the {duration} online Skill Development Program in
                        </p>

                        <h3 className="text-2xl font-semibold italic my-6">
                            {courseName}
                        </h3>

                        <p className="text-lg">
                            offered by {issuedBy} through {platform}
                        </p>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-12 flex items-end justify-between gap-6">
                        {/* Company Dossier - Bottom Left */}
                        <div className="text-left text-xs text-gray-700 max-w-sm leading-relaxed">
                            <p className="font-bold text-sm mb-2">NAIR SOLUTIONS</p>
                            <p className="mb-1"><span className="font-semibold">Reg. No:</span> {regNo}</p>
                            <p className="mb-1"><span className="font-semibold">GSTIN:</span> {gstin}</p>
                            <p className="mb-1"><span className="font-semibold">Email:</span> {email}</p>
                            <p className="mb-2"><span className="font-semibold">Website:</span> {website}</p>
                        </div>

                        {/* Certificate ID - Bottom Center */}
                        <div className="text-center flex-shrink-0">
                            <p className="text-sm font-semibold mb-2">Certificate ID:</p>
                            <p className="text-lg font-bold">{certificateId}</p>
                        </div>

                        {/* Signature - Bottom Right */}
                        <div className="text-center flex-shrink-0">
                            <img
                                src="/src/assets/signature.png"
                                alt="Authorized Signature"
                                className="h-16 mb-2 mx-auto"
                            />
                            <div className="border-t border-gray-800 pt-2">
                                <p className="text-sm font-bold">{ceoName}</p>
                                <p className="text-xs text-gray-600">{ceoTitle}</p>
                                <p className="text-xs text-gray-600">{issuedBy}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillCertificate;
