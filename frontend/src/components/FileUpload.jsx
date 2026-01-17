import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

export const FileUpload = ({ onFileUpload, isUploading }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div
            className={`glass-card animate-fade-in`}
            style={{
                padding: '60px',
                textAlign: 'center',
                border: dragActive ? '2px dashed var(--primary)' : '2px dashed var(--glass-border)',
                backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)',
                transition: 'all 0.3s',
                maxWidth: '600px',
                margin: '40px auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleChange}
                accept=".pdf,.docx,.txt"
            />

            {isUploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <Loader2 size={48} className="animate-spin" color="var(--primary)" />
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Parsing Resume...</p>
                </div>
            ) : (
                <>
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.2)',
                        padding: '20px',
                        borderRadius: '50%',
                        marginBottom: '10px'
                    }}>
                        <Upload size={40} color="var(--primary)" />
                    </div>
                    <h2 style={{ margin: 0 }}>Drop your resume here</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Supports PDF, DOCX, TXT</p>
                    <button className="btn-primary" onClick={onButtonClick}>
                        Browse Files
                    </button>
                </>
            )}
        </div>
    );
};
