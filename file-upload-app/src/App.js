import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
  return (
    <div className="App">
      <h1>File Upload and Retrieval</h1>
      <FileUpload />
      <FileList />
    </div>
  );
}

export default App;
