import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/FileList.css';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/files`);
                console.log("Fetched files: ", response.data);
                if (Array.isArray(response.data)) {
                    setFiles(response.data);
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (error) {
                console.error("Error fetching files:", error);
                setError("Failed to load files. Please try again.");
            }
        };

        fetchFiles();
    }, []);

    const handleDelete = async (filename) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete/${filename}`);
            setFiles((prevFiles) => prevFiles.filter((file) => file.name !== filename));
            console.log(`File ${filename} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting file ${filename}:`, error);
            setError(`Failed to delete file: ${filename}`);
        }
    }

    return (
        <div className='file-list'>
            <h3>Uploaded Files</h3>
            {error && <p className='Error'>{error}</p>}
            <ul>
                {files.length > 0 ? (
                    files.map((file) => (
                        <li key={file.name}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.name}
                            </a>
                            <button onClick={() => handleDelete(file.name)}>Delete</button>
                        </li>
                    ))
                ) : (
                    !error && <li>No files available</li>
                )}
            </ul>
        </div>
    );
};

export default FileList;
