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

router.get("/:name", async (req, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: req.params.name
    });

    const data = await r2.send(command);

    data.Body.pipe(res); // Stream to browser
  } catch (error) {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;