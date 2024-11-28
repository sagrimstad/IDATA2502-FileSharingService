const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins or specific frontend origin
app.use(cors({
  origin: process.env.REACT_FRONTEND_ORIGIN,
}));

// Google Cloud Storage configuration
const storage = new Storage({ projectId: process.env.PROJECT_ID });
const bucketName = process.env.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file uploaded. Request body:", req.body);
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file);

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype || "application/octet-stream",
    });

    blobStream.on("error", (err) => {
      console.error("Error during file stream:", err.message);
      res.status(500).send({ error: err.message });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      console.log("File successfully uploaded:", publicUrl);
      res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Unexpected error in /upload route:", error);
    res.status(500).send({ error: error.message });
  }
});

// Route to list files in the bucket
app.get("/files", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileData = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
    }));
    res.status(200).json(fileData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete file from bucket
app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;

  try {
    const file = bucket.file(filename);
    await file.delete();
    console.log(`File ${filename} deleted successfully`);
    res.status(200).json({ message: `File ${filename} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);
    res.status(500).json({ error: `Failed to delete file: ${error.message}` });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));