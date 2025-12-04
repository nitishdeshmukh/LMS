import express from "express";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { r2 } from "../../config/r2.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log('hi :>> ');
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await r2.send(new PutObjectCommand(uploadParams));

    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/*", async (req, res) => {
  try {
    // Get the full path after /api/r2/
    const key = req.params[0];
    
    if (!key) {
      return res.status(400).json({ error: "File key is required" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key
    });

    const data = await r2.send(command);

    // Set content type header
    if (data.ContentType) {
      res.setHeader('Content-Type', data.ContentType);
    }

    data.Body.pipe(res); // Stream to browser
  } catch (error) {
    console.error("R2 fetch error:", error);
    res.status(404).json({ error: "File not found" });
  }
});

export default router;