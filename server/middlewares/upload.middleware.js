import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// Check file type (optional, but recommended)
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|pdf|zip|doc|docx/;
    // Check extension
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: File type not allowed!");
    }
}

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    // fileFilter: function (req, file, cb) {
    //   checkFileType(file, cb);
    // }
}).single("taskFile"); // 'taskFile' is the name of the form field

export default upload;
