import Student from "../../models/student.js";

export const seedStudents = async () => {
    const students = [
        {
            email: "student1@example.com",
            name: "Rahul",
            lastName: "Sharma",
            phoneNumber: "9876543210",
            collegeName: "IIT Delhi",
            courseName: "B.Tech CSE",
            yearOfStudy: "3rd Year",
            accountStatus: "enrolled",
            lmsId: "LMS001",
            lmsPassword: "Lms@123",
            myReferralCode: "RAHU-A1B2",
            xp: 0,
            hoursLearned: 0,
            quizzesCompleted: 0,
            assignmentsCompleted: 0,
        },
        {
            email: "student2@example.com",
            name: "Priya",
            lastName: "Patel",
            phoneNumber: "9876543211",
            collegeName: "NIT Trichy",
            courseName: "B.Tech IT",
            yearOfStudy: "2nd Year",
            accountStatus: "enrolled",
            lmsId: "LMS002",
            lmsPassword: "Lms@123",
            myReferralCode: "PRIY-C3D4",
            xp: 0,
            hoursLearned: 0,
            quizzesCompleted: 0,
            assignmentsCompleted: 0,
        },
        {
            email: "student3@example.com",
            name: "Amit",
            lastName: "Kumar",
            phoneNumber: "9876543212",
            collegeName: "BITS Pilani",
            courseName: "B.Tech ECE",
            yearOfStudy: "4th Year",
            accountStatus: "unenrolled",
            lmsId: "LMS003",
            lmsPassword: "Lms@123",
            myReferralCode: "AMIT-E5F6",
            xp: 0,
            hoursLearned: 0,
            quizzesCompleted: 0,
            assignmentsCompleted: 0,
        },
    ];

    for (const studentData of students) {
        const student = new Student(studentData);
        await student.save();
    }

    console.log(`   ✓ Created ${students.length} students`);
    console.log("   📋 Test Credentials: LMS001, LMS002, LMS003 / Lms@123");
};
