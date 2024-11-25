const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


// Google Cloud Storage configuration
const storage = new Storage({ projectId: "idata2502-cloudproject" });
const bucketName = 'file-sharing-service'
const bucket = storage.bucket(bucketName);

const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: 'No file uploaded'});
    }
    
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.originalname,
      predefinedAcl: 'publicRead',
    });

    blobStream.on("error", (err) => res.status(500).send({ error: err.message }));

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.status(200).json({ message: 'File uploaded successfully', url: publicUrl});
    });
      
    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to list files in the bucket
app.get("/files", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileData = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucketName}/${file.name}`
    }));
    res.status(200).json(fileData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));