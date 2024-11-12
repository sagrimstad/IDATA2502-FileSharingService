const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Google Cloud Storage with your project ID
const storage = new Storage({ projectId: "idata2502-cloudproject" });
const bucket = storage.bucket("file-sharing-service");

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => res.status(500).send({ error: err.message }));
    blobStream.on("finish", () => res.status(200).send({ fileName: req.file.originalname }));

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to list files in the bucket
app.get("/files", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.status(200).send(files.map(file => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
    })));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
