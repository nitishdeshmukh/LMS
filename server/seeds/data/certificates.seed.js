import { faker } from "@faker-js/faker";
import { Certificate, Enrollment } from "../../models/index.js";
import crypto from "crypto";

// Generate certificate PDF URL
const generateCertificatePdfUrl = (certificateId) => {
    return `https://storage.example.com/certificates/${certificateId}.pdf`;
};

// Generate certificate ID
const generateCertificateId = () => {
    return `C2D-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

export const seedCertificates = async () => {
    // Get all completed enrollments with populated student and course data
    const completedEnrollments = await Enrollment.find({
        isCompleted: true,
        certificateId: { $exists: true },
    })
        .populate("student", "name middleName lastName")
        .populate("course", "title");

    if (completedEnrollments.length === 0) {
        console.log(
            "⚠️  Skipping certificates: No completed enrollments found"
        );
        return;
    }

    const certificates = [];

    for (const enrollment of completedEnrollments) {
        const student = enrollment.student;
        const course = enrollment.course;

        // Build full student name
        const studentFullName = [
            student.name,
            student.middleName,
            student.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        // Use existing certificate ID from enrollment or generate new one
        const certificateId =
            enrollment.certificateId || generateCertificateId();

        const certificate = {
            certificateId: certificateId,
            student: student._id,
            course: course._id,
            issueDate:
                enrollment.completionDate || faker.date.past({ years: 1 }),
            studentNameSnapshot: studentFullName,
            courseNameSnapshot: course.title,
            pdfUrl: generateCertificatePdfUrl(certificateId),
        };

        certificates.push(certificate);

        // Update enrollment with certificate ID if it doesn't have one
        if (!enrollment.certificateId) {
            enrollment.certificateId = certificateId;
            await enrollment.save();
        }
    }

    // Add some additional certificates for other completed courses (edge cases)
    // These might be certificates issued before the current enrollment system
    const additionalCertificates = faker.number.int({ min: 5, max: 10 });
    const allStudents = await Enrollment.find()
        .populate("student", "name middleName lastName")
        .populate("course", "title")
        .limit(50);

    for (let i = 0; i < additionalCertificates && i < allStudents.length; i++) {
        const enrollment = faker.helpers.arrayElement(allStudents);
        const student = enrollment.student;
        const course = enrollment.course;

        // Skip if already has certificate
        const existingCert = certificates.find(
            (c) =>
                c.student.toString() === student._id.toString() &&
                c.course.toString() === course._id.toString()
        );
        if (existingCert) continue;

        const studentFullName = [
            student.name,
            student.middleName,
            student.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        const certificateId = generateCertificateId();

        certificates.push({
            certificateId: certificateId,
            student: student._id,
            course: course._id,
            issueDate: faker.date.past({ years: 2 }),
            studentNameSnapshot: studentFullName,
            courseNameSnapshot: course.title,
            pdfUrl: generateCertificatePdfUrl(certificateId),
        });
    }

    await Certificate.insertMany(certificates);

    console.log(`✅ ${certificates.length} certificates seeded`);
    console.log(
        `   🎓 ${completedEnrollments.length} certificates for completed enrollments`
    );
    console.log(
        `   📜 ${
            certificates.length - completedEnrollments.length
        } additional legacy certificates`
    );

    // Show sample certificates
    const sampleCerts = certificates.slice(0, 3);
    console.log("   📋 Sample Certificates:");
    sampleCerts.forEach((cert) => {
        console.log(
            `      - ${cert.certificateId}: ${cert.studentNameSnapshot} - ${cert.courseNameSnapshot}`
        );
    });
};
