import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// Import images
import signatureImg from '@/assets/images/sign.jpg';
import msmeLogoImg from '@/assets/images/MSMElogo.jpeg';
import certificateBgImg from '@/assets/images/certificateBG.jpeg';

/**
 * Converts an image URL to base64 data URL
 */
const toBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

/**
 * Creates a multi-page PDF certificate with:
 * 1. Internship Certificate (Certificate of Achievement) - Standard Certificate Size (landscape)
 * 2. Letter of Completion (LOC) - A4 Portrait
 * 3. Skill Certificate - Standard Certificate Size (landscape)
 */
export const downloadFinalCertificate = async ({
  studentName = 'Student',
  courseName = 'Course',
  certificateId = '',
  issueDate = new Date(),
  duration = '3 months',
}) => {
  // Calculate conducted period
  const endDate = new Date(issueDate);
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 3);
  const conductedFrom = `${startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  // Convert all images to base64 for reliable embedding
  const [signatureBase64, msmeLogoBase64, certificateBgBase64] = await Promise.all([
    toBase64(signatureImg),
    toBase64(msmeLogoImg),
    toBase64(certificateBgImg),
  ]);

  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Certificate configurations with different sizes
  // Standard certificate: 11" x 8.5" (279.4mm x 215.9mm) - landscape
  // A4 portrait: 210mm x 297mm
  const certificates = [
    {
      name: 'Internship Certificate',
      html: generateInternshipCertificate(studentName, courseName, certificateId, conductedFrom, duration, signatureBase64, certificateBgBase64),
      width: 1056,
      height: 816,
      pdfWidth: 279.4,
      pdfHeight: 215.9,
      orientation: 'landscape',
    },
    {
      name: 'Letter of Completion',
      html: generateLetterOfCompletion(studentName, courseName, duration, certificateId, signatureBase64),
      width: 794,
      height: 1123,
      pdfWidth: 210,
      pdfHeight: 297,
      orientation: 'portrait',
    },
    {
      name: 'Skill Certificate',
      html: generateSkillCertificate(studentName, courseName, duration, certificateId, signatureBase64, msmeLogoBase64),
      width: 1056,
      height: 816,
      pdfWidth: 279.4,
      pdfHeight: 215.9,
      orientation: 'landscape',
    },
  ];

  // Start with first certificate's orientation
  const pdf = new jsPDF({
    orientation: certificates[0].orientation,
    unit: 'mm',
    format: [certificates[0].pdfWidth, certificates[0].pdfHeight],
  });

  try {
    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];

      // Create certificate element
      const certificateEl = document.createElement('div');
      certificateEl.style.width = `${cert.width}px`;
      certificateEl.style.height = `${cert.height}px`;
      certificateEl.style.background = 'white';
      certificateEl.style.fontFamily = "'Inter', Arial, sans-serif";
      certificateEl.innerHTML = cert.html;
      container.appendChild(certificateEl);

      // Convert to image
      const dataUrl = await toPng(certificateEl, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      // Add page with correct orientation (except for first page)
      if (i > 0) {
        pdf.addPage([cert.pdfWidth, cert.pdfHeight], cert.orientation);
      }

      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, cert.pdfWidth, cert.pdfHeight);

      // Remove certificate element
      container.removeChild(certificateEl);
    }

    // Download PDF
    pdf.save(
      `${studentName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}_Certificate.pdf`,
    );

    return true;
  } catch (error) {
    console.error('Failed to download certificate:', error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
};

// Generate Internship Certificate (Certificate of Achievement) HTML
function generateInternshipCertificate(studentName, courseName,certificateId, conductedFrom, duration, signatureImg, certificateBgImg) {
  return `
    <div style="position: relative; width: 100%; height: 100%; background-image: url('${certificateBgImg}'); background-size: cover; background-position: top right; background-repeat: no-repeat; box-sizing: border-box;">
      
      <!-- Main Content Overlay -->
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 60px; box-sizing: border-box; text-align: center;">
      
        <div style="color: #1a365d; position: absolute; top: 32px; left: 32px;">
            <span style="display: block; font-weight: 600; color: #1a365d; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; margin-bottom: 4px;">Certificate ID</span>
            ${certificateId || 'NS-LOR-GEN-' + Date.now().toString().slice(-6)}
        </div>

        <!-- Logo -->
        <div style="margin-bottom: 10px;">
          <div style="display: inline-block; position: relative;">
            <span style="font-size: 44px; font-weight: bold; color: #1a365d; font-family: Georgia, serif;">NS</span>
          </div>
          <p style="font-size: 10px; color: #1a365d; font-weight: 600; letter-spacing: 3px; margin: 6px 0 0 0;">N.A.I.R.SOLUTIONS</p>
        </div>

        <!-- Main Title -->
        <h1 style="font-size: 56px; font-weight: bold; color: #1a365d; letter-spacing: 6px; margin: 8px 0 0 0; font-family: Georgia, serif;">CERTIFICATE</h1>
        <h2 style="font-size: 16px; font-weight: 500; color: #1a365d; letter-spacing: 6px; margin: 4px 0 18px 0;">OF ACHIEVEMENT</h2>

        <!-- Presented To -->
        <p style="font-size: 14px; font-weight: 600; color: #1a365d; letter-spacing: 3px; margin: 0;">THIS CERTIFICATE IS PRESENTED TO</p>

        <!-- Student Name -->
        <h3 style="font-size: 44px; color: #b45309; margin: 14px 0; font-family: 'Brush Script MT', 'Segoe Script', cursive; font-weight: normal;">${studentName}</h3>

        <!-- From -->
        <p style="font-size: 18px; color: #1a365d; margin: 4px 0;">From <span style="font-weight: bold;">CODE2DBUG</span></p>

        <!-- Description -->
        <p style="font-size: 18px; color: #1a365d; line-height: 1.5; max-width: 550px; margin: 10px auto;">
          In recognition of his/her efforts and achievement in completing the <span style="font-weight: 600;">${courseName}</span><br/>
          <span style="font-weight: 600;">${duration}</span> internship program.
        </p>

        <!-- Footer Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%; margin-top: auto; padding: 0 16px;">
          
          <!-- Company Dossier -->
          <div style="text-align: left; max-width: 260px; background: rgba(255,255,255,0.9); padding: 10px 12px; border-radius: 4px;">
            <h4 style="font-size: 9px; font-weight: bold; color: #1a1a1a; margin: 0 0 6px 0; padding-bottom: 3px; border-bottom: 2px solid #1a1a1a; letter-spacing: 1px;">OFFICIAL COMPANY DOSSIER</h4>
            <div style="font-size: 8px; color: #333; line-height: 1.5;">
              <p style="margin: 2px 0;"><strong>Email:</strong> pravinrnair@nairsolutions.org</p>
              <p style="margin: 2px 0;"><strong>Website:</strong> code2dbug.com</p>
              <p style="margin: 2px 0;"><strong>Reg. No:</strong> UDYAM-CG-05-0062143</p>
              <p style="margin: 2px 0;"><strong>GSTIN:</strong> 22DMOPP2753L</p>
              <p style="margin: 2px 0; font-size: 7px; line-height: 1.3;"><strong>Address:</strong> Shop No - 17, Govind 8D LIG, G.T. Road, Bhilai, Durg, Chhattisgarh</p>
            </div>
          </div>

          <!-- Signature Section -->
          <div style="text-align: center; max-width: 180px; background: rgba(255,255,255,0.9); padding: 8px 16px; border-radius: 4px;">
            <img src="${signatureImg}" alt="Signature" style="height: 50px; margin-bottom: 4px; display: block; margin-left: auto; margin-right: auto;" />
            <div style="border-top: 2px solid #1a365d; padding-top: 6px;">
              <p style="font-size: 11px; font-weight: bold; color: #1a365d; margin: 0; letter-spacing: 1px;">PRAVIN.R.NAIR</p>
              <p style="font-size: 9px; color: #1a365d; margin: 2px 0 0 0;">Company CEO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate Letter of Completion (LOC) HTML - A4 Portrait
function generateLetterOfCompletion(studentName, courseName, duration, certificateId, signatureImg) {
  return `
    <div style="width: 100%; height: 100%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; font-family: 'Inter', Arial, sans-serif;">
      <div style="width: 100%; height: 100%; background: white; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
        
        <!-- Top Decorative Border -->
        <div style="height: 8px; width: 100%; background: linear-gradient(to right, #fbbf24, #f59e0b, #f97316);"></div>
        
        <div style="padding: 40px 48px; height: calc(100% - 8px); box-sizing: border-box; display: flex; flex-direction: column; line-height: 1.7;">
          
          <!-- Header Section -->
          <header style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px;">
            <div>
              <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: 0.025em; margin: 0; font-family: Georgia, serif; text-transform: uppercase;">Nair Solutions</h1>
              <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0; letter-spacing: 0.08em; font-weight: 600; text-transform: uppercase;">We code, We debug, We deliver</p>
            </div>
            <div style="text-align: right; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0;">pravinrnair@nairsolutions.org</p>
              <p style="margin: 0;">code2dbug.com</p>
              <p style="margin: 0;">UDYAM-CG-05-0062143</p>
              <p style="margin: 0;">22DMOPP2753L</p>
            </div>
          </header>

          <!-- Salutation -->
          <div style="margin-bottom: 24px;">
            <p style="font-size: 16px; font-weight: 500; color: #0f172a; margin: 0;">To Whom It May Concern,</p>
          </div>

          <!-- Body Content -->
          <div style="flex: 1; font-size: 14px; color: #475569; text-align: justify; display: flex; flex-direction: column; gap: 18px;">
            <p style="margin: 0;">
              It is with distinct pleasure and professional confidence that I write this letter of recommendation for
              <span>${studentName}</span>.
              As the CEO of NAIR SOLUTIONS, I have had the unique opportunity to observe professional growth,
              work ethic, and contributions at a strategic level, and I can attest that they are an individual of
              exceptional caliber.
            </p>

            <p style="margin: 0;">
              During their
              <span>${duration}</span>
              internship with our organization, where they successfully completed the
              <span>${courseName}</span>
              program,
              <span>${studentName}</span>
              consistently demonstrated a rare combination of technical acumen and emotional intelligence.
              They possess an innate ability to navigate complex challenges with clarity and precision, often turning potential
              obstacles into opportunities for innovation. Their approach to work is characterized by unwavering reliability
              and a proactive mindset that sets a benchmark for their peers.
            </p>

            <p style="margin: 0;">
              What stands out most, however, is their integrity and capacity for leadership. Whether working independently
              or collaborating within a diverse team, they maintain the highest standards of professional conduct.
              They are not merely an employee who executes tasks; they are a thinker who adds value to the conceptualization
              and execution of projects. Their adaptability allows them to thrive in dynamic, high-pressure environments
              characteristic of today's global market.
            </p>

            <p style="margin: 0;">
              <span>${studentName}</span>
              leaves NAIR SOLUTIONS with a spotless record and my highest endorsement. I am certain that they will
              bring the same level of dedication, skill, and positive energy to your organization. They have my full support
              in their future endeavors, and I am confident they will be a significant asset to any team they join.
            </p>
          </div>

          <!-- Closing -->
          <div style="margin-top: 32px;">
            <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">Sincerely,</p>

            <div style="margin-bottom: 8px;">
              <img src="${signatureImg}" alt="Signature" style="height: 56px; margin-bottom: 8px; display: block;" />
            </div>

            <div style="color: #0f172a;">
              <p style="font-size: 16px; font-weight: 700; margin: 0;">Pravin R Nair</p>
              <p style="font-size: 14px; font-weight: 500; color: #4b5563; margin: 2px 0 0 0;">Chief Executive Officer</p>
              <p style="font-size: 14px; font-weight: 500; color: #4b5563; margin: 0;">NAIR SOLUTIONS</p>
            </div>

            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; gap: 60px; font-size: 13px; color: #64748b;">
              <div>
                <span style="display: block; font-weight: 600; color: #0891b2; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; margin-bottom: 4px;">Contact</span>
                info@code2dbug.com
              </div>
              <div>
                <span style="display: block; font-weight: 600; color: #0891b2; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; margin-bottom: 4px;">Certificate ID</span>
                ${certificateId || 'NS-LOR-GEN-' + Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate Skill Certificate HTML - Standard Certificate Size
function generateSkillCertificate(studentName, courseName, duration, certificateId, signatureImg, msmeLogoImg) {
  return `
    <div style="width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box;">
      <div style="position: relative; width: 100%; height: 100%; background: white; border: 14px solid #ca8a04; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
        
        <!-- Header with Logos -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px 40px 20px 40px;">
          <!-- MSME Logo -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="${msmeLogoImg}" alt="MSME Logo" style="height: 82px;" />
          </div>

          <!-- Company Logo -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <h1 style="font-size: 42px; font-weight: bold; color: #2c3e50; margin: 0; letter-spacing: 0.1em; font-family: Georgia, serif;">NS</h1>
            <p style="font-size: 12px; color: #2c3e50; letter-spacing: 0.3em; font-weight: 500; margin: 6px 0 0 0;">N.A.I.R.SOLUTIONS</p>
          </div>
        </div>

        <!-- Certificate Content -->
        <div style="padding: 16px 40px 24px 40px; text-align: center;">
          <h1 style="font-size: 32px; font-weight: bold; text-align: center; margin: 0 0 24px 0; letter-spacing: 0.05em; font-family: Georgia, serif; color: #1e293b;">SKILL CERTIFICATE</h1>

          <div style="text-align: center; color: #1e293b; display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 16px; margin: 0;">This is to certify that</p>

            <h2 style="font-size: 28px; font-weight: bold; margin: 4px 0; font-family: Georgia, serif; color: #1e293b;">${studentName}</h2>

            <p style="font-size: 16px; margin: 0; color: #1e293b;">
              has successfully completed the <span style="font-weight: 600;">${duration}</span> online Skill Development Program in
            </p>

            <h3 style="font-size: 20px; font-weight: 600; font-style: italic; margin: 8px 0; color: #334155;">${courseName}</h3>

            <p style="font-size: 16px; margin: 0; color: #1e293b;">
              offered by <span style="font-weight: 600;">NAIR SOLUTIONS</span> through <span style="font-weight: 600;">Code2Dbug.com</span>
            </p>
          </div>

          <!-- Footer Section -->
          <div style="margin-top: 96px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;">
            
            <!-- Company Dossier - Bottom Left -->
            <div style="text-align: left; font-size: 11px; color: #374151; max-width: 280px; line-height: 1.5;">
              <p style="font-weight: bold; font-size: 12px; margin: 0 0 6px 0;">NAIR SOLUTIONS</p>
              <p style="margin: 3px 0;"><span style="font-weight: 600;">Reg. No:</span> UDYAM-CG-05-0062143</p>
              <p style="margin: 3px 0;"><span style="font-weight: 600;">GSTIN:</span> 22DMOPP2753L</p>
              <p style="margin: 3px 0;"><span style="font-weight: 600;">Email:</span> pravinrnair@nairsolutions.org</p>
              <p style="margin: 3px 0;"><span style="font-weight: 600;">Website:</span> code2dbug.com</p>
            </div>

            <!-- Certificate ID - Bottom Center -->
            <div style="text-align: center; flex-shrink: 0;">
              <p style="font-size: 12px; font-weight: 600; color: #2c3e50; margin: 0 0 6px 0;">Certificate ID:</p>
              <p style="font-size: 16px; font-weight: bold; margin: 0; color: #1e293b;">${certificateId || 'CERT' + Date.now().toString().slice(-8)}</p>
            </div>

            <!-- Signature - Bottom Right -->
            <div style="text-align: center; flex-shrink: 0;">
              <img src="${signatureImg}" alt="Signature" style="height: 56px; margin: 0 auto 6px; display: block;" />
              <div style="border-top: 1px solid #1a365d; padding-top: 6px; min-width: 140px;">
                <p style="font-size: 12px; font-weight: bold; margin: 0; color: #1a365d;">PRAVIN.R.NAIR</p>
                <p style="font-size: 10px; color: #374151; margin: 2px 0 0 0;">Company CEO</p>
                <p style="font-size: 10px; color: #374151; margin: 0;">NAIR SOLUTIONS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
