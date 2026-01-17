import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

const ConfidentInput = ({ label, value, confidence, onChange, type = "text" }) => {
    const isLowConfidence = confidence < 70;

    return (
        <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="label">{label}</label>
                <span style={{
                    fontSize: '0.75rem',
                    color: isLowConfidence ? 'var(--warning)' : 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {isLowConfidence ? <AlertCircle size={12} /> : <Check size={12} />}
                    {confidence}% Match
                </span>
            </div>
            <input
                type={type}
                className={`input-field ${isLowConfidence ? 'confidence-amber' : 'confidence-green'}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export const Editor = ({ data, setData, onSave, originalFile }) => {

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "resume_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const updateField = (field, newVal) => {
        setData(prev => ({
            ...prev,
            [field]: { ...prev[field], value: newVal }
        }));
    };

    const updateExperience = (index, field, newVal) => {
        const newExp = [...data.experience];
        newExp[index][field] = { ...newExp[index][field], value: newVal };
        setData(prev => ({ ...prev, experience: newExp }));
    };

    const updateEducation = (index, field, newVal) => {
        const newEdu = [...data.education];
        newEdu[index][field] = { ...newEdu[index][field], value: newVal };
        setData(prev => ({ ...prev, education: newEdu }));
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '30px', height: 'calc(100vh - 100px)' }}>
            {/* PREVIEW PANEL */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '15px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                    <span style={{ fontWeight: '600' }}>Original Resume</span>
                </div>
                <div style={{ flex: 1, background: '#fff' }}>
                    {originalFile ? (
                        <iframe
                            src={URL.createObjectURL(originalFile)}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="Resume Preview"
                        />
                    ) : (
                        <div style={{ padding: '20px', color: '#333' }}>No preview available</div>
                    )}
                </div>
            </div>

            {/* EDITOR PANEL */}
            <div className="glass-card" style={{ padding: '20px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Review & Correct</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)' }} onClick={downloadJSON}>Export JSON</button>
                        <button className="btn-primary" onClick={onSave}>Confirm & Save</button>
                    </div>
                </div>

                <section style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Personal Info</h3>
                    <ConfidentInput
                        label="Full Name"
                        value={data.name.value}
                        confidence={data.name.confidence}
                        onChange={(v) => updateField('name', v)}
                    />
                    <ConfidentInput
                        label="Email"
                        value={data.email.value}
                        confidence={data.email.confidence}
                        onChange={(v) => updateField('email', v)}
                    />
                    <ConfidentInput
                        label="Phone"
                        value={data.phone.value}
                        confidence={data.phone.confidence}
                        onChange={(v) => updateField('phone', v)}
                    />
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.skills.map((skill, idx) => (
                            <span
                                key={idx}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--glass-border)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {skill.value}
                            </span>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Experience</h3>
                    {data.experience.map((exp, idx) => (
                        <div key={idx} style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '15px' }}>
                            <ConfidentInput
                                label="Role"
                                value={exp.title.value}
                                confidence={exp.title.confidence}
                                onChange={(v) => updateExperience(idx, 'title', v)}
                            />
                            <ConfidentInput
                                label="Company"
                                value={exp.company.value}
                                confidence={exp.company.confidence}
                                onChange={(v) => updateExperience(idx, 'company', v)}
                            />
                            <ConfidentInput
                                label="Duration"
                                value={exp.duration.value}
                                confidence={exp.duration.confidence}
                                onChange={(v) => updateExperience(idx, 'duration', v)}
                            />
                        </div>
                    ))}
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Education</h3>
                    {data.education.map((edu, idx) => (
                        <div key={idx} style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '15px' }}>
                            <ConfidentInput
                                label="Degree"
                                value={edu.degree.value}
                                confidence={edu.degree.confidence}
                                onChange={(v) => updateEducation(idx, 'degree', v)}
                            />
                            <ConfidentInput
                                label="Institution"
                                value={edu.institution.value}
                                confidence={edu.institution.confidence}
                                onChange={(v) => updateEducation(idx, 'institution', v)}
                            />
                            <ConfidentInput
                                label="Year"
                                value={edu.year.value}
                                confidence={edu.year.confidence}
                                onChange={(v) => updateEducation(idx, 'year', v)}
                            />
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
};
