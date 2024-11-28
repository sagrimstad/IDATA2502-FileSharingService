const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const app = express();

app.use(cors({ origin: "https://react-frontend-104390666503.europe-north1.run.app" }));
const upload = multer({ storage: multer.memoryStorage() });

// Google Cloud Storage configuration
const storage = new Storage({ projectId: "idata2502-cloudproject" });
const bucketName = "file-sharing-service" || "test-bucket";
const bucket = storage.bucket(bucketName);


// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype || "application/octet-stream",
    });
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list files in the bucket
app.get("/files", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.status(200).json(files.map(file => ({ name: file.name, url: `https://storage.googleapis.com/${bucketName}/${file.name}` })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file from bucket
app.delete("/delete/:filename", async (req, res) => {
  try {
    const file = bucket.file(req.params.filename);
    await file.delete();
    res.status(200).json({ message: `File ${req.params.filename} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;