import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Creates a multi-page PDF certificate with:
 * 1. Internship Certificate
 * 2. Letter of Completion (LOC)
 * 3. Skill Certificate
 */
export const downloadFinalCertificate = async ({
  studentName = 'Student',
  courseName = 'Course',
  certificateId = '',
  issueDate = new Date(),
  skills = [],
}) => {
  const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Default skills if none provided
  const defaultSkills = getSkillsForCourse(courseName);
  const certificateSkills = skills.length > 0 ? skills : defaultSkills;

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
      html: generateInternshipCertificate(studentName, courseName, formattedDate, certificateId),
    },
    {
      name: 'Letter of Completion',
      html: generateLetterOfCompletion(studentName, courseName, formattedDate),
    },
    {
      name: 'Skill Certificate',
      html: generateSkillCertificate(studentName, courseName, certificateSkills, formattedDate),
    },
  ];

  try {
    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];

      // Create certificate element
      const certificateEl = document.createElement('div');
      certificateEl.style.width = '1123px'; // A4 landscape at 96 DPI
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
      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210); // A4 landscape dimensions in mm

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

// Helper function to get skills based on course name
function getSkillsForCourse(courseName) {
  const lowerCourse = courseName.toLowerCase();

  if (
    lowerCourse.includes('full stack') ||
    lowerCourse.includes('fullstack') ||
    lowerCourse.includes('mern')
  ) {
    return [
      'React.js',
      'Node.js',
      'MongoDB',
      'Express.js',
      'JavaScript',
      'REST APIs',
      'Git & GitHub',
    ];
  } else if (lowerCourse.includes('frontend') || lowerCourse.includes('front-end')) {
    return ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Responsive Design', 'Git & GitHub'];
  } else if (lowerCourse.includes('backend') || lowerCourse.includes('back-end')) {
    return ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Authentication', 'Database Design'];
  } else if (lowerCourse.includes('python')) {
    return ['Python', 'Django/Flask', 'Data Structures', 'Algorithms', 'Database Management'];
  } else if (lowerCourse.includes('data science') || lowerCourse.includes('machine learning')) {
    return [
      'Python',
      'Pandas',
      'NumPy',
      'Machine Learning',
      'Data Visualization',
      'Statistical Analysis',
    ];
  } else if (
    lowerCourse.includes('ux') ||
    lowerCourse.includes('ui') ||
    lowerCourse.includes('design')
  ) {
    return [
      'UI/UX Design',
      'Figma',
      'User Research',
      'Wireframing',
      'Prototyping',
      'Design Systems',
    ];
  } else {
    return [
      'Problem Solving',
      'Technical Skills',
      'Project Management',
      'Team Collaboration',
      'Communication',
    ];
  }
}

// Generate Internship Certificate HTML
function generateInternshipCertificate(studentName, courseName, date, certificateId) {
  return `
    <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%); overflow: hidden; box-sizing: border-box;">
      <!-- Border Design -->
      <div style="position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border: 3px solid #1e3a5f; border-radius: 8px;"></div>
      <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1px solid #d4af37; border-radius: 4px;"></div>

      <!-- Decorative Corner Elements -->
      <div style="position: absolute; top: 30px; left: 30px; width: 60px; height: 60px; border-left: 3px solid #d4af37; border-top: 3px solid #d4af37;"></div>
      <div style="position: absolute; top: 30px; right: 30px; width: 60px; height: 60px; border-right: 3px solid #d4af37; border-top: 3px solid #d4af37;"></div>
      <div style="position: absolute; bottom: 30px; left: 30px; width: 60px; height: 60px; border-left: 3px solid #d4af37; border-bottom: 3px solid #d4af37;"></div>
      <div style="position: absolute; bottom: 30px; right: 30px; width: 60px; height: 60px; border-right: 3px solid #d4af37; border-bottom: 3px solid #d4af37;"></div>

      <!-- Main Content -->
      <div style="position: relative; padding: 50px 80px; text-align: center; height: 100%; box-sizing: border-box;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 20px;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #1e3a5f, #0f1f3a); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(30,58,95,0.3);">
            <span style="font-size: 24px; font-weight: bold; color: #d4af37;">NS</span>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 10px; color: #666; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0;">N.A.I.R. Solutions</p>
            <p style="font-size: 20px; font-weight: bold; color: #1e3a5f; letter-spacing: 2px; margin: 0;">CODE2DBUG</p>
          </div>
        </div>

        <!-- Title -->
        <div style="margin-bottom: 25px;">
          <h1 style="font-size: 42px; font-weight: 400; color: #1e3a5f; letter-spacing: 8px; margin: 0; text-transform: uppercase;">INTERNSHIP</h1>
          <h2 style="font-size: 28px; font-weight: 300; color: #d4af37; letter-spacing: 12px; margin: 5px 0 0 0; text-transform: uppercase;">Certificate</h2>
        </div>

        <!-- Decorative Line -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 25px;">
          <div style="height: 2px; width: 100px; background: linear-gradient(to right, transparent, #d4af37);"></div>
          <div style="width: 10px; height: 10px; transform: rotate(45deg); background: #d4af37;"></div>
          <div style="height: 2px; width: 100px; background: linear-gradient(to left, transparent, #d4af37);"></div>
        </div>

        <!-- Body -->
        <p style="font-size: 14px; color: #555; margin: 0 0 15px 0;">This is to certify that</p>

        <h3 style="font-size: 36px; font-weight: 400; color: #1e3a5f; margin: 0 0 10px 0; border-bottom: 2px solid #d4af37; display: inline-block; padding-bottom: 5px;">${studentName}</h3>

        <p style="font-size: 14px; color: #555; margin: 20px 0; line-height: 1.8; max-width: 700px; margin-left: auto; margin-right: auto;">
          has successfully completed a comprehensive internship program in <strong style="color: #1e3a5f;">${courseName}</strong>
          at Code2Dbug, N.A.I.R. Solutions. During this internship, the candidate demonstrated exceptional dedication,
          technical proficiency, and professional growth.
        </p>

        <!-- Date & ID -->
        <div style="display: flex; justify-content: center; gap: 50px; margin: 25px 0;">
          <div>
            <p style="font-size: 11px; color: #888; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Date of Issue</p>
            <p style="font-size: 14px; color: #1e3a5f; font-weight: 600; margin: 5px 0 0 0;">${date}</p>
          </div>
          <div>
            <p style="font-size: 11px; color: #888; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Certificate ID</p>
            <p style="font-size: 14px; color: #1e3a5f; font-weight: 600; margin: 5px 0 0 0;">${certificateId}</p>
          </div>
        </div>

        <!-- Signature Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding: 0 60px;">
          <div style="text-align: center;">
            <div style="width: 150px; border-top: 1px solid #333; padding-top: 5px;">
              <p style="font-size: 12px; color: #333; margin: 0; font-weight: 600;">Pravin R. Nair</p>
              <p style="font-size: 10px; color: #666; margin: 2px 0 0 0;">Director, N.A.I.R. Solutions</p>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="width: 150px; border-top: 1px solid #333; padding-top: 5px;">
              <p style="font-size: 12px; color: #333; margin: 0; font-weight: 600;">Authorized Signature</p>
              <p style="font-size: 10px; color: #666; margin: 2px 0 0 0;">Code2Dbug Program</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="position: absolute; bottom: 30px; left: 0; right: 0; text-align: center;">
          <p style="font-size: 9px; color: #888; margin: 0;">www.code2dbug.com | pravinrnair@nairsolutions.org | UDYAM-CG-05-0062143</p>
        </div>
      </div>
    </div>
  `;
}

// Generate Letter of Completion HTML
function generateLetterOfCompletion(studentName, courseName, date) {
  return `
    <div style="position: relative; width: 100%; height: 100%; background: #ffffff; overflow: hidden; box-sizing: border-box;">
      <!-- Letterhead Design -->
      <div style="background: linear-gradient(135deg, #1e3a5f, #0f1f3a); padding: 25px 60px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 2px solid #d4af37; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 22px; font-weight: bold; color: #d4af37;">NS</span>
          </div>
          <div>
            <p style="font-size: 9px; color: rgba(255,255,255,0.7); font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0;">N.A.I.R. Solutions</p>
            <p style="font-size: 22px; font-weight: bold; color: white; letter-spacing: 2px; margin: 0;">CODE2DBUG</p>
          </div>
        </div>
        <div style="text-align: right; color: rgba(255,255,255,0.8); font-size: 11px;">
          <p style="margin: 0;">Bhilai, Durg, Chhattisgarh</p>
          <p style="margin: 3px 0 0 0;">UDYAM-CG-05-0062143</p>
        </div>
      </div>

      <!-- Letter Content -->
      <div style="padding: 40px 70px;">
        <!-- Title -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; color: #1e3a5f; letter-spacing: 6px; margin: 0; text-transform: uppercase; font-weight: 400;">Letter of Completion</h1>
          <div style="width: 80px; height: 3px; background: #d4af37; margin: 12px auto 0;"></div>
        </div>

        <!-- Date -->
        <p style="text-align: right; font-size: 13px; color: #555; margin: 0 0 25px 0;">Date: ${date}</p>

        <!-- To Whom -->
        <p style="font-size: 14px; color: #333; margin: 0 0 20px 0; font-weight: 600;">To Whom It May Concern,</p>

        <!-- Letter Body -->
        <div style="font-size: 13px; color: #444; line-height: 1.9; text-align: justify;">
          <p style="margin: 0 0 15px 0;">
            This letter is to certify that <strong style="color: #1e3a5f;">${studentName}</strong> has successfully completed 
            the <strong style="color: #1e3a5f;">${courseName}</strong> program at Code2Dbug, a flagship initiative of 
            N.A.I.R. Solutions.
          </p>
          
          <p style="margin: 0 0 15px 0;">
            During the program duration, ${studentName} demonstrated exceptional commitment to learning, consistently 
            meeting project deadlines and actively participating in all training modules. The candidate showed remarkable 
            aptitude in understanding complex concepts and applying them effectively in practical scenarios.
          </p>
          
          <p style="margin: 0 0 15px 0;">
            Throughout the internship, ${studentName} successfully completed all assigned projects, including the capstone 
            project, showcasing proficiency in industry-standard tools and technologies. The quality of work submitted 
            was consistently above expectations, reflecting a strong foundation in the subject matter.
          </p>
          
          <p style="margin: 0 0 15px 0;">
            We are confident that ${studentName} possesses the technical skills and professional attitude required to 
            excel in the industry. We wish them continued success in their future endeavors.
          </p>
        </div>

        <!-- Closing -->
        <p style="font-size: 13px; color: #444; margin: 25px 0 5px 0;">Sincerely,</p>

        <!-- Signature -->
        <div style="margin-top: 40px;">
          <p style="font-size: 14px; color: #1e3a5f; font-weight: 600; margin: 0;">Pravin R. Nair</p>
          <p style="font-size: 12px; color: #666; margin: 3px 0;">Director, N.A.I.R. Solutions</p>
          <p style="font-size: 11px; color: #888; margin: 3px 0;">pravinrnair@nairsolutions.org</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(135deg, #1e3a5f, #0f1f3a); padding: 12px 60px; display: flex; justify-content: space-between; align-items: center;">
        <p style="font-size: 10px; color: rgba(255,255,255,0.7); margin: 0;">www.code2dbug.com</p>
        <p style="font-size: 10px; color: rgba(255,255,255,0.7); margin: 0;">Empowering Future Tech Leaders</p>
      </div>
    </div>
  `;
}

// Generate Skill Certificate HTML
function generateSkillCertificate(studentName, courseName, skills, date) {
  const skillsHtml = skills
    .map(
      skill => `
    <div style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #f0f7ff, #e6f0fa); padding: 8px 16px; border-radius: 20px; border: 1px solid #c5ddf8; margin: 4px;">
      <div style="width: 8px; height: 8px; background: #1e3a5f; border-radius: 50%;"></div>
      <span style="font-size: 12px; color: #1e3a5f; font-weight: 500;">${skill}</span>
    </div>
  `,
    )
    .join('');

  return `
    <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #fefefe 0%, #f5f8fc 100%); overflow: hidden; box-sizing: border-box;">
      <!-- Border Design -->
      <div style="position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border: 3px solid #1e3a5f; border-radius: 8px;"></div>
      <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 1px solid #4a90d4; border-radius: 4px;"></div>

      <!-- Decorative Pattern -->
      <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle at top right, rgba(74,144,212,0.1), transparent); pointer-events: none;"></div>
      <div style="position: absolute; bottom: 0; left: 0; width: 300px; height: 300px; background: radial-gradient(circle at bottom left, rgba(74,144,212,0.1), transparent); pointer-events: none;"></div>

      <!-- Main Content -->
      <div style="position: relative; padding: 45px 70px; text-align: center; height: 100%; box-sizing: border-box;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 15px;">
          <div style="width: 65px; height: 65px; border-radius: 50%; background: linear-gradient(135deg, #1e3a5f, #0f1f3a); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(30,58,95,0.3);">
            <span style="font-size: 22px; font-weight: bold; color: #d4af37;">NS</span>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 9px; color: #666; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0;">N.A.I.R. Solutions</p>
            <p style="font-size: 18px; font-weight: bold; color: #1e3a5f; letter-spacing: 2px; margin: 0;">CODE2DBUG</p>
          </div>
        </div>

        <!-- Title -->
        <div style="margin-bottom: 20px;">
          <h1 style="font-size: 38px; font-weight: 400; color: #1e3a5f; letter-spacing: 6px; margin: 0; text-transform: uppercase;">Skill</h1>
          <h2 style="font-size: 26px; font-weight: 300; color: #4a90d4; letter-spacing: 10px; margin: 5px 0 0 0; text-transform: uppercase;">Certificate</h2>
        </div>

        <!-- Decorative Line -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
          <div style="height: 2px; width: 80px; background: linear-gradient(to right, transparent, #4a90d4);"></div>
          <div style="width: 8px; height: 8px; transform: rotate(45deg); background: #4a90d4;"></div>
          <div style="height: 2px; width: 80px; background: linear-gradient(to left, transparent, #4a90d4);"></div>
        </div>

        <!-- Body -->
        <p style="font-size: 13px; color: #555; margin: 0 0 12px 0;">This is to certify that</p>

        <h3 style="font-size: 32px; font-weight: 400; color: #1e3a5f; margin: 0 0 12px 0; border-bottom: 2px solid #4a90d4; display: inline-block; padding-bottom: 5px;">${studentName}</h3>

        <p style="font-size: 13px; color: #555; margin: 15px 0;">
          has demonstrated proficiency in the following skills through successful completion of
        </p>
        
        <p style="font-size: 16px; color: #1e3a5f; font-weight: 600; margin: 0 0 20px 0;">${courseName}</p>

        <!-- Skills Grid -->
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 0 auto 25px; max-width: 600px; border: 1px solid #e0e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <p style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">Verified Skills</p>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
            ${skillsHtml}
          </div>
        </div>

        <!-- Date & Signature -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px;">
          <div style="text-align: center;">
            <p style="font-size: 10px; color: #888; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Date of Issue</p>
            <p style="font-size: 13px; color: #1e3a5f; font-weight: 600; margin: 5px 0 0 0;">${date}</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 140px; border-top: 1px solid #333; padding-top: 5px;">
              <p style="font-size: 11px; color: #333; margin: 0; font-weight: 600;">Pravin R. Nair</p>
              <p style="font-size: 9px; color: #666; margin: 2px 0 0 0;">Director, N.A.I.R. Solutions</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="position: absolute; bottom: 30px; left: 0; right: 0; text-align: center;">
          <p style="font-size: 9px; color: #888; margin: 0;">www.code2dbug.com | pravinrnair@nairsolutions.org | Bhilai, Durg, Chhattisgarh</p>
        </div>
      </div>
    </div>
  `;
}
