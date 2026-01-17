import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Editor } from './components/Editor';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file) => {
    setOriginalFile(file);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('http://localhost:8002/api/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Parsing failed");

      const data = await response.json();
      setResumeData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to parse resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setOriginalFile(null);
    setIsUploading(false);
  };

  const handleSave = async () => {
    try {
      await fetch('http://localhost:8002/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: resumeData }),
      });
      alert("Profile Saved Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    }
  };

  return (
    <div className="App">
      <Header onNewUpload={handleReset} />
      <main>
        {!resumeData && !isUploading && (
          <div style={{ marginTop: '100px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI-Powered Resume Transformation
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                Drag, drop, and let our intelligent engine structure your career data.
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
          </div>
        )}

        {isUploading && !resumeData && (
          <div style={{ marginTop: '100px' }}>
            <FileUpload onFileUpload={() => { }} isUploading={true} />
          </div>
        )}

        {resumeData && (
          <Editor
            data={resumeData}
            setData={setResumeData}
            onSave={handleSave}
            originalFile={originalFile}
          />
        )}
      </main>
    </div>
  );
}

export default App;
