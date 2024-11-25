import React, { useState } from 'react';
import axios from 'axios';
import './styles/FileUpload.css';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
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
            });
            setMessage("File uploaded successfully");
            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error.response || error);
            setMessage("Failed to upload file.");
        }
    };

    return (
        <div className='file-upload'>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;