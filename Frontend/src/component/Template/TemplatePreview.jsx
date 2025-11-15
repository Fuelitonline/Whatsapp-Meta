import React from 'react';
import { Link, Phone } from '@mui/icons-material';

const TemplatePreview = ({ selectedTemplate, renderFormattedText }) => {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                Rendered Preview
            </h4>
            <div style={{ padding: '20px', background: 'linear-gradient(145deg, #F3F4F6, #E5E7EB)', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <div style={{
                    maxWidth: '320px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    position: 'relative',
                }}>
                    {selectedTemplate.components.header && (
                        selectedTemplate.components.header.format === 'TEXT' ? (
                            <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: '1rem', color: '#000' }}>
                                {selectedTemplate.components.header.text}
                            </div>
                        ) : (
                            <div style={{ width: '100%' }}>
                                {selectedTemplate.components.header.file && (
                                    <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                                        <span>{selectedTemplate.components.header.format}: {selectedTemplate.components.header.file} (Preview not available)</span>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                    {selectedTemplate.components.body && (
                        <div style={{ padding: '8px 12px', fontSize: '0.875rem', color: '#000', whiteSpace: 'pre-wrap' }}>
                            {renderFormattedText(selectedTemplate.components.body.text, selectedTemplate.sampleValues)}
                        </div>
                    )}
                    {selectedTemplate.components.footer && (
                        <div style={{ padding: '0 12px 8px', fontSize: '0.75rem', color: '#666' }}>
                            {selectedTemplate.components.footer.text}
                        </div>
                    )}
                    {selectedTemplate.components.buttons && (
                        <div style={{ borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '8px' }}>
                            {selectedTemplate.components.buttons.map((button, index) => (
                                <button
                                    key={index}
                                    style={{
                                        padding: '8px',
                                        textAlign: 'left',
                                        border: 'none',
                                        background: 'none',
                                        color: '#00A884',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    {button.type === 'URL' && <Link style={{ fontSize: '16px', color: '#00A884' }} />}
                                    {button.type === 'CALL' && <Phone style={{ fontSize: '16px', color: '#00A884' }} />}
                                    {button.text}
                                </button>
                            ))}
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '4px', right: '8px', fontSize: '0.6875rem', color: '#666' }}>
                        2:03 PM
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;