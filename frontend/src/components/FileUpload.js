import React, { useState } from 'react';
import axios from 'axios';
import './styles/FileUpload.css';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [sortOption, setSortOption] = useState("date");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
        setUploadProgress(0);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            const newFile = { name: file.name, date: new Date() };
            setUploadedFiles((prevFiles) => [...prevFiles, newFile]);

            setMessage("File uploaded successfully");
            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error.response || error);
            setMessage("Failed to upload file.");
        }
    };

    const sortFiles = () => {
        return [...uploadedFiles].sort((a, b) => {
            if (sortOption === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortOption === "date") {
                return new Date(b.date) - new Date(a.date);
            }
            return 0;
        });
    }

    return (
        <div className='file-upload'>
            <div className="file-input-container">
                <label className="file-label">
                    <input type="file" onChange={handleFileChange} />Choose File
                </label>
                <span className="file-name">{file ? file.name : "No file chosen"}</span>
            </div>
            <button
                onClick={handleUpload}
                disabled={!file}
                className={!file ? 'disabled' : ''}
            >
                Upload File
            </button>
            {uploadProgress > 0 && (
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${uploadProgress}%` }}>
                        {uploadProgress}%
                    </div>
                </div>
            )}
            {message && <p>{message}</p>}

            {/* Sorting Options */}
            <div className="sort-options">
                <label>Sort By:</label>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="date">Upload Date</option>
                    <option value="name">File Name</option>
                </select>
            </div>

            {/* Render Sorted File List */}
            <ul className="uploaded-files">
                {sortFiles().map((file, index) => (
                    <li key={index}>
                        <strong>{file.name}</strong> - {file.date.toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileUpload;