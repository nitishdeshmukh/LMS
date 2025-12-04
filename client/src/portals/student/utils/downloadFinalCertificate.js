import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Creates a multi-page PDF certificate with:
 * 1. Internship Certificate (Certificate of Achievement)
 * 2. Letter of Completion (LOC)
 * 3. Skill Certificate
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

  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // Create PDF (A4 landscape)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const certificates = [
    {
      name: 'Internship Certificate',
      html: generateInternshipCertificate(studentName, courseName, conductedFrom, duration),
    },
    {
      name: 'Letter of Completion',
      html: generateLetterOfCompletion(studentName, courseName, duration, certificateId),
    },
    {
      name: 'Skill Certificate',
      html: generateSkillCertificate(studentName, courseName, duration, certificateId),
    },
  ];

  try {
    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];

      // Create certificate element
      const certificateEl = document.createElement('div');
      certificateEl.style.width = '1123px';
      certificateEl.style.height = '794px';
      certificateEl.style.background = 'white';
      certificateEl.style.fontFamily = "Georgia, 'Times New Roman', serif";
      certificateEl.innerHTML = cert.html;
      container.appendChild(certificateEl);

      // Convert to image
      const dataUrl = await toPng(certificateEl, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      // Add page (except for first page)
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);

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
function generateInternshipCertificate(studentName, courseName, conductedFrom, duration) {
  return `
    <div style="position: relative; width: 100%; height: 100%; background: #243d5c; display: flex; align-items: center; justify-content: center; padding: 40px; box-sizing: border-box;">
      <!-- Certificate Inner Container -->
      <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%); border-radius: 4px; overflow: hidden;">
        
        <!-- Decorative Border -->
        <div style="position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 2px solid #c9a961; border-radius: 2px;"></div>
        <div style="position: absolute; top: 25px; left: 25px; right: 25px; bottom: 25px; border: 1px solid #d4b87a;"></div>
        
        <!-- Corner Decorations -->
        <div style="position: absolute; top: 20px; left: 20px; width: 50px; height: 50px; border-left: 3px solid #c9a961; border-top: 3px solid #c9a961;"></div>
        <div style="position: absolute; top: 20px; right: 20px; width: 50px; height: 50px; border-right: 3px solid #c9a961; border-top: 3px solid #c9a961;"></div>
        <div style="position: absolute; bottom: 20px; left: 20px; width: 50px; height: 50px; border-left: 3px solid #c9a961; border-bottom: 3px solid #c9a961;"></div>
        <div style="position: absolute; bottom: 20px; right: 20px; width: 50px; height: 50px; border-right: 3px solid #c9a961; border-bottom: 3px solid #c9a961;"></div>

        <!-- Main Content -->
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 50px 60px; box-sizing: border-box; text-align: center;">
          
          <!-- Logo -->
          <div style="margin-bottom: 8px;">
            <div style="display: inline-block; position: relative;">
              <span style="font-size: 48px; font-weight: bold; color: #243d5c; font-family: Georgia, serif;">NS</span>
            </div>
            <p style="font-size: 11px; color: #243d5c; font-weight: 600; letter-spacing: 4px; margin: 8px 0 0 0;">N.A.I.R.SOLUTIONS</p>
          </div>

          <!-- Main Title -->
          <h1 style="font-size: 62px; font-weight: bold; color: #243d5c; letter-spacing: 8px; margin: 10px 0 0 0; font-family: Georgia, serif;">CERTIFICATE</h1>
          <h2 style="font-size: 18px; font-weight: 500; color: #243d5c; letter-spacing: 8px; margin: 5px 0 20px 0;">OF ACHIEVEMENT</h2>

          <!-- Presented To -->
          <p style="font-size: 16px; font-weight: 600; color: #243d5c; letter-spacing: 4px; margin: 0;">THIS CERTIFICATE IS PRESENTED TO</p>

          <!-- Student Name -->
          <h3 style="font-size: 48px; color: #d4a574; margin: 15px 0; font-family: 'Brush Script MT', 'Segoe Script', cursive; font-weight: normal;">${studentName}</h3>

          <!-- From -->
          <p style="font-size: 16px; color: #243d5c; margin: 5px 0;">From <span style="font-weight: bold;">CODE2DBUG</span></p>

          <!-- Description -->
          <p style="font-size: 15px; color: #243d5c; line-height: 1.6; max-width: 600px; margin: 10px auto;">
            In recognition of his/her efforts and achievement in completing the <span style="font-weight: 600;">${courseName}</span><br/>
            <span style="font-weight: 600;">${duration}</span> internship program.
          </p>

          <!-- Conducted From -->
          <p style="font-size: 15px; font-weight: 600; color: #243d5c; margin: 15px 0 25px 0;">
            Conducted From <span style="font-weight: bold;">${conductedFrom}</span>
          </p>

          <!-- Footer Section -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%; margin-top: auto; padding: 0 20px;">
            
            <!-- Company Dossier -->
            <div style="text-align: left; max-width: 280px;">
              <h4 style="font-size: 10px; font-weight: bold; margin: 0 0 8px 0; padding-bottom: 4px; border-bottom: 2px solid #000; letter-spacing: 1px;">OFFICIAL COMPANY DOSSIER</h4>
              <div style="font-size: 9px; color: #333; line-height: 1.6;">
                <p style="margin: 3px 0;"><span style="color: #ea580c;">✉</span> <strong>Email:</strong> pravinrnair@nairsolutions.org</p>
                <p style="margin: 3px 0;"><span style="color: #2563eb;">🌐</span> <strong>Website:</strong> www.code2dbug.com</p>
                <p style="margin: 3px 0;"><span style="color: #dc2626;">📄</span> <strong>Reg. No:</strong> UDYAM-CG-05-0062143</p>
                <p style="margin: 3px 0;"><span style="color: #f97316;">🏢</span> <strong>GSTIN:</strong> 22DMOPP2753L</p>
                <p style="margin: 3px 0; font-size: 7px; line-height: 1.4;"><span style="color: #ef4444;">📍</span> <strong>Address:</strong> Shop No - 17, Govind 8D LIG, G.T. Road, Bhilai, Durg, Chhattisgarh</p>
              </div>
            </div>

            <!-- Signature Section -->
            <div style="text-align: center; max-width: 200px;">
              <div style="height: 50px; margin-bottom: 5px;"></div>
              <div style="border-top: 2px solid #243d5c; padding-top: 8px;">
                <p style="font-size: 12px; font-weight: bold; color: #243d5c; margin: 0; letter-spacing: 1px;">PRAVIN.R.NAIR</p>
                <p style="font-size: 10px; color: #243d5c; margin: 3px 0 0 0;">Company CEO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate Letter of Completion (LOC) HTML
function generateLetterOfCompletion(studentName, courseName, duration, certificateId) {
  return `
    <div style="width: 100%; height: 100%; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 30px; box-sizing: border-box;">
      <div style="width: 100%; height: 100%; background: white; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
        
        <!-- Top Decorative Border -->
        <div style="height: 8px; width: 100%; background: linear-gradient(to right, #facc15, #f59e0b, #ea580c);"></div>
        
        <div style="padding: 50px 70px; height: calc(100% - 8px); box-sizing: border-box; display: flex; flex-direction: column;">
          
          <!-- Header Section -->
          <header style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid #e2e8f0; padding-bottom: 25px; margin-bottom: 35px;">
            <div>
              <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: 1px; margin: 0; font-family: Georgia, serif;">Nair Solutions</h1>
              <p style="font-size: 10px; color: #94a3b8; margin: 5px 0 0 0; letter-spacing: 3px; font-weight: 600;">WE CODE, WE DEBUG, WE DELIVER</p>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0;">pravinrnair@nairsolutions.org</p>
              <p style="margin: 0;">code2dbug.com</p>
              <p style="margin: 0;">UDYAM-CG-05-0062143</p>
              <p style="margin: 0;">22DMOPP2753L</p>
            </div>
          </header>

          <!-- Salutation -->
          <div style="margin-bottom: 25px;">
            <p style="font-size: 16px; font-weight: 500; color: #0f172a; margin: 0;">To Whom It May Concern,</p>
          </div>

          <!-- Body Content -->
          <div style="flex: 1; font-size: 14px; color: #475569; line-height: 1.9; text-align: justify;">
            <p style="margin: 0 0 18px 0;">
              It is with distinct pleasure and professional confidence that I write this letter of recommendation for
              <span style="font-weight: bold; background: #fefce8; padding: 0 4px; color: #0f172a; border-bottom: 2px solid #fef08a;">${studentName}</span>.
              As the CEO of NAIR SOLUTIONS, I have had the unique opportunity to observe professional growth,
              work ethic, and contributions at a strategic level, and I can attest that they are an individual of
              exceptional caliber.
            </p>

            <p style="margin: 0 0 18px 0;">
              During their
              <span style="background: #fefce8; padding: 0 4px; border-bottom: 2px solid #fef08a;">${duration}</span>
              internship with our organization, where they successfully completed the
              <span style="background: #fefce8; padding: 0 4px; border-bottom: 2px solid #fef08a;">${courseName}</span>
              program,
              <span style="background: #fefce8; padding: 0 4px; border-bottom: 2px solid #fef08a;">${studentName}</span>
              consistently demonstrated a rare combination of technical acumen and emotional intelligence.
              They possess an innate ability to navigate complex challenges with clarity and precision, often turning potential
              obstacles into opportunities for innovation.
            </p>

            <p style="margin: 0 0 18px 0;">
              What stands out most, however, is their integrity and capacity for leadership. Whether working independently
              or collaborating within a diverse team, they maintain the highest standards of professional conduct.
              They are not merely an employee who executes tasks; they are a thinker who adds value to the conceptualization
              and execution of projects.
            </p>

            <p style="margin: 0;">
              <span style="background: #fefce8; padding: 0 4px; border-bottom: 2px solid #fef08a;">${studentName}</span>
              leaves NAIR SOLUTIONS with a spotless record and my highest endorsement. I am certain that they will
              bring the same level of dedication, skill, and positive energy to any organization. They have my full support
              in their future endeavors.
            </p>
          </div>

          <!-- Closing -->
          <div style="margin-top: 30px;">
            <p style="font-size: 14px; color: #475569; margin: 0 0 25px 0;">Sincerely,</p>

            <div style="margin-bottom: 5px; height: 45px;"></div>

            <div>
              <p style="font-size: 16px; font-weight: bold; color: #0f172a; margin: 0;">Pravin R Nair</p>
              <p style="font-size: 13px; font-weight: 500; color: #64748b; margin: 3px 0 0 0;">Chief Executive Officer</p>
              <p style="font-size: 13px; font-weight: 500; color: #64748b; margin: 0;">NAIR SOLUTIONS</p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; gap: 80px; font-size: 11px; color: #64748b;">
              <div>
                <span style="display: block; font-weight: 600; color: #0891b2; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; margin-bottom: 3px;">Contact</span>
                info@code2dbug.com
              </div>
              <div>
                <span style="display: block; font-weight: 600; color: #0891b2; text-transform: uppercase; font-size: 9px; letter-spacing: 1px; margin-bottom: 3px;">Verification ID</span>
                ${certificateId || 'NS-LOR-GEN-' + Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate Skill Certificate HTML
function generateSkillCertificate(studentName, courseName, duration, certificateId) {
  return `
    <div style="width: 100%; height: 100%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 30px; box-sizing: border-box;">
      <div style="position: relative; width: 100%; height: 100%; background: white; border: 16px solid #ca8a04;">
        
        <!-- Header with Logos -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 30px 50px 20px 50px;">
          <!-- MSME Logo Placeholder -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 60px; height: 60px; border: 2px solid #1e3a5f; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 10px; font-weight: bold; color: #1e3a5f; text-align: center;">MSME<br/>GOVT</span>
            </div>
          </div>

          <!-- Company Logo -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <h1 style="font-size: 48px; font-weight: bold; color: #2c3e50; margin: 0; letter-spacing: 3px; font-family: Georgia, serif;">NS</h1>
            <p style="font-size: 11px; color: #2c3e50; letter-spacing: 5px; font-weight: 500; margin: 5px 0 0 0;">N.A.I.R.SOLUTIONS</p>
          </div>
        </div>

        <!-- Certificate Content -->
        <div style="padding: 20px 50px 30px 50px; text-align: center;">
          <h1 style="font-size: 36px; font-weight: bold; color: #1e293b; letter-spacing: 3px; margin: 0 0 30px 0; font-family: Georgia, serif;">SKILL CERTIFICATE</h1>

          <div style="text-align: center;">
            <p style="font-size: 16px; color: #475569; margin: 0 0 15px 0;">This is to certify that</p>

            <h2 style="font-size: 32px; font-weight: bold; color: #1e293b; margin: 10px 0 20px 0; font-family: Georgia, serif;">${studentName}</h2>

            <p style="font-size: 15px; color: #475569; margin: 0 0 10px 0;">
              has successfully completed the ${duration} online Skill Development Program in
            </p>

            <h3 style="font-size: 22px; font-weight: 600; font-style: italic; color: #334155; margin: 20px 0 25px 0;">${courseName}</h3>

            <p style="font-size: 15px; color: #475569; margin: 0;">
              offered by NAIR SOLUTIONS through Code2Dbug.com
            </p>
          </div>

          <!-- Footer Section -->
          <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-top: 40px; gap: 30px;">
            
            <!-- Company Dossier - Bottom Left -->
            <div style="text-align: left; font-size: 10px; color: #4b5563; max-width: 280px; line-height: 1.5;">
              <p style="font-weight: bold; font-size: 11px; margin: 0 0 8px 0;">NAIR SOLUTIONS</p>
              <p style="margin: 2px 0;"><strong>Reg. No:</strong> UDYAM-CG-05-0062143</p>
              <p style="margin: 2px 0;"><strong>GSTIN:</strong> 22DMOPP2753L</p>
              <p style="margin: 2px 0;"><strong>Email:</strong> pravinrnair@nairsolutions.org</p>
              <p style="margin: 2px 0;"><strong>Website:</strong> www.code2dbug.com</p>
            </div>

            <!-- Certificate ID - Bottom Center -->
            <div style="text-align: center; flex-shrink: 0;">
              <p style="font-size: 11px; font-weight: 600; color: #4b5563; margin: 0 0 5px 0;">Certificate ID:</p>
              <p style="font-size: 14px; font-weight: bold; color: #1e293b; margin: 0;">${certificateId || 'CERT' + Date.now().toString().slice(-8)}</p>
            </div>

            <!-- Signature - Bottom Right -->
            <div style="text-align: center; flex-shrink: 0;">
              <div style="height: 45px; margin-bottom: 5px;"></div>
              <div style="border-top: 1px solid #1f2937; padding-top: 8px; min-width: 150px;">
                <p style="font-size: 12px; font-weight: bold; color: #1e293b; margin: 0;">PRAVIN.R.NAIR</p>
                <p style="font-size: 10px; color: #6b7280; margin: 3px 0 0 0;">Company CEO</p>
                <p style="font-size: 10px; color: #6b7280; margin: 0;">NAIR SOLUTIONS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
