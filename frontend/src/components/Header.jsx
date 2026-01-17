import React from 'react';

export const Header = ({ onNewUpload }) => {
    return (
        <header style={{
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--primary), #ec4899)',
                    borderRadius: '8px'
                }}></div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>SmartResume</h1>
            </div>
            <nav>
                <button className="btn-primary" style={{ background: 'transparent', boxShadow: 'none' }}>History</button>
                <button className="btn-primary" onClick={onNewUpload}>New Upload</button>
            </nav>
        </header>
    );
};
