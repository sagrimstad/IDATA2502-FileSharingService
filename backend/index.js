const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins or specific frontend origin
app.use(cors({
  origin: "https://react-frontend-104390666503.europe-north1.run.app" // Allow your React frontend origin
}));

// Google Cloud Storage configuration
const storage = new Storage({ projectId: "idata2502-cloudproject" });
const bucketName = "file-sharing-service";
const bucket = storage.bucket(bucketName);

const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file uploaded in the request.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file);

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
      predefinedAcl: "publicRead",
    });

    blobStream.on("error", (err) => {
      console.error("Error during file upload:", err);
      res.status(500).send({ error: err.message });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      console.log("File uploaded successfully:", publicUrl);
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
