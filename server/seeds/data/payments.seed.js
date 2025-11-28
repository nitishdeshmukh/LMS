import { faker } from "@faker-js/faker";
import { Payment, Enrollment } from "../../models/index.js";

// Indian Banks
const indianBanks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Kotak Mahindra Bank",
    "Yes Bank",
    "IDFC First Bank",
    "IndusInd Bank",
    "Canara Bank",
    "Union Bank of India",
];

// Generate realistic Indian IFSC code
const generateIFSC = (bankName) => {
    const bankCodes = {
        "State Bank of India": "SBIN",
        "HDFC Bank": "HDFC",
        "ICICI Bank": "ICIC",
        "Axis Bank": "UTIB",
        "Punjab National Bank": "PUNB",
        "Bank of Baroda": "BARB",
        "Kotak Mahindra Bank": "KKBK",
        "Yes Bank": "YESB",
        "IDFC First Bank": "IDFB",
        "IndusInd Bank": "INDB",
        "Canara Bank": "CNRB",
        "Union Bank of India": "UBIN",
    };

    const code = bankCodes[bankName] || "BANK";
    return `${code}0${faker.string.numeric(6)}`;
};

// Generate realistic transaction ID
const generateTransactionId = () => {
    const prefixes = ["TXN", "UTR", "REF", "PAY", "IMPS", "NEFT"];
    const prefix = faker.helpers.arrayElement(prefixes);
    const timestamp = Date.now().toString().slice(-10);
    const random = faker.string.alphanumeric(6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
};

// Admin remarks for different statuses
const verifiedRemarks = [
    "Payment verified successfully",
    "Bank details matched. Payment confirmed",
    "Transaction validated with bank records",
    "Payment received and credited",
    "Verified - Amount received in college account",
];

const rejectedRemarks = [
    "Invalid transaction ID. Please resubmit with correct details",
    "Bank account mismatch. Name does not match student records",
    "Payment screenshot is unclear. Please upload a better quality image",
    "Insufficient amount paid. Required: ₹500",
    "Transaction not found in bank records",
    "Duplicate payment submission detected",
    "IFSC code is invalid. Please check and resubmit",
    "Payment already processed for this enrollment",
];

export const seedPayments = async () => {
    // Get all enrollments with populated data
    const enrollments = await Enrollment.find()
        .populate("student")
        .populate("course")
        .limit(50);

    if (enrollments.length === 0) {
        console.log("⚠️  Skipping payments: No enrollments found");
        return;
    }

    const payments = [];

    // Create payments for most enrollments (80-90%)
    const enrollmentsWithPayment = enrollments.filter(() =>
        faker.datatype.boolean(0.85)
    );

    for (const enrollment of enrollmentsWithPayment) {
        const student = enrollment.student;
        const course = enrollment.course;

        const bankName = faker.helpers.arrayElement(indianBanks);
        const status = faker.helpers.weightedArrayElement([
            { weight: 6, value: "verified" },
            { weight: 2, value: "submitted" },
            { weight: 1, value: "rejected" },
        ]);

        // Generate account holder name (usually student's name or parent's name)
        const isParentAccount = faker.datatype.boolean(0.3); // 30% paid by parents
        const accountHolderName = isParentAccount
            ? faker.person.fullName() // Parent's name
            : `${student.name} ${student.lastName || ""}`.trim();

        const payment = {
            student: student._id,
            course: course._id,
            enrollment: enrollment._id,
            accountHolderName: accountHolderName.toUpperCase(),
            bankName: bankName,
            ifscCode: generateIFSC(bankName),
            accountNumber: faker.string.numeric(11), // 11-digit account number
            transactionId: generateTransactionId(),
            screenshotUrl: faker.helpers.maybe(
                () =>
                    `https://storage.example.com/payments/${faker.string.uuid()}.jpg`,
                { probability: 0.8 }
            ),
            amount: faker.helpers.arrayElement([500, 500, 500, 499, 501, 1000]), // Mostly 500
            currency: "INR",
            status: status,
            createdAt: faker.date.between({
                from:
                    enrollment.createdAt ||
                    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                to: new Date(),
            }),
        };

        // Add admin remarks for verified/rejected payments
        if (status === "verified") {
            payment.adminRemarks = faker.helpers.arrayElement(verifiedRemarks);
            payment.updatedAt = faker.date.between({
                from: payment.createdAt,
                to: new Date(),
            });
        } else if (status === "rejected") {
            payment.adminRemarks = faker.helpers.arrayElement(rejectedRemarks);
            payment.updatedAt = faker.date.between({
                from: payment.createdAt,
                to: new Date(),
            });
        } else {
            // Submitted - no remarks yet, updatedAt same as createdAt
            payment.updatedAt = payment.createdAt;
        }

        payments.push(payment);
    }

    // Create some duplicate/resubmitted payments (for rejected cases)
    const resubmissions = faker.number.int({ min: 3, max: 8 });

    for (let i = 0; i < resubmissions && i < enrollments.length; i++) {
        const enrollment = faker.helpers.arrayElement(enrollments);
        const student = enrollment.student;
        const course = enrollment.course;
        const bankName = faker.helpers.arrayElement(indianBanks);

        payments.push({
            student: student._id,
            course: course._id,
            enrollment: enrollment._id,
            accountHolderName: `${student.name} ${student.lastName || ""}`
                .trim()
                .toUpperCase(),
            bankName: bankName,
            ifscCode: generateIFSC(bankName),
            accountNumber: faker.string.numeric(11),
            transactionId: generateTransactionId(),
            screenshotUrl: `https://storage.example.com/payments/${faker.string.uuid()}.jpg`,
            amount: 500,
            currency: "INR",
            status: "submitted", // Resubmitted, waiting for verification
            createdAt: faker.date.recent({ days: 7 }),
        });
    }

    await Payment.insertMany(payments);

    const statusCounts = {
        verified: payments.filter((p) => p.status === "verified").length,
        submitted: payments.filter((p) => p.status === "submitted").length,
        rejected: payments.filter((p) => p.status === "rejected").length,
    };

    console.log(`✅ ${payments.length} payments seeded`);
    console.log(
        `   📊 Verified: ${statusCounts.verified}, Submitted: ${statusCounts.submitted}, Rejected: ${statusCounts.rejected}`
    );
};
