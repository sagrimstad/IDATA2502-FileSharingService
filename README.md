# File-Sharing Service
My Submission of portfolio assignment in the course IDATA2502 - Cloud Services Administration

A simple, serverless file-sharing service built using Gooogle Cloud Platform (GCP).
This project demonstrates the practcal application of cloud services, containerization, and CI/CD pipelines in a real-world use case.


## Features

- Upload and share files across devices and users.
- Built using serverless architecture for scalability and cost-efficiency.
- Easy-to-use React frontend for file management.
- Node.js backend, containerized with Docker.
- CI/CD pipeline impolemtned with GitHub Actions for automated deployment.

## System Architecture

The system is composed of the following components:
- **Frontend**: React-based web application for user interaction.
- **Backend**: Node.js server managing file uploads and retrieval.
- **Cloud Services**:
    - Google Cloud Run: Host the backend as a containerized application.
    - Google Cloud Storage: Secure file storage.
    - Artifact Registry: Manages Docker images for deployment.


## View website

The project is available on the web: 
https://react-frontend-104390666503.europe-north1.run.app/

## Repository Structure

```
IDATA2502-Filesharing-Serice/
├── .github/
│   └── workflow/
│       └── deploy.yml
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── FileList.js
│   │   │   ├── FileUpload.js
│   │   │   └── styles/
│   │   │       └── ...
│   │   └── ...
│   └── ...
├── README.md
└── ...
```