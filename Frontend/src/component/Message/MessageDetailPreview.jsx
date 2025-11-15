import React from 'react';
import { Link, Phone, LocationOn } from '@mui/icons-material';

const MessageDetailPreview = ({ selectedMessage, renderFormattedText }) => {
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
                    {selectedMessage.type === 'Template' && selectedMessage.template?.components.header && (
                        selectedMessage.template.components.header.format === 'TEXT' ? (
                            <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: '1rem', color: '#000' }}>
                                {selectedMessage.template.components.header.text}
                            </div>
                        ) : (
                            <div style={{ width: '100%' }}>
                                {selectedMessage.template.components.header.file && (
                                    <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                                        <span>{selectedMessage.template.components.header.format}: {selectedMessage.template.components.header.file} (Preview not available)</span>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                    {(selectedMessage.text || (selectedMessage.type === 'Template' && selectedMessage.template?.components.body?.text)) && (
                        <div style={{ padding: '8px 12px', fontSize: '0.875rem', color: '#000', whiteSpace: 'pre-wrap' }}>
                            {renderFormattedText(
                                selectedMessage.type === 'Template' ? selectedMessage.template?.components.body?.text : selectedMessage.text,
                                selectedMessage.sampleValues
                            )}
                        </div>
                    )}
                    {selectedMessage.mediaType === 'location' && selectedMessage.location && (
                        <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                            <LocationOn style={{ fontSize: '24px', color: '#00A884', verticalAlign: 'middle', marginRight: '6px' }} />
                            <span>
                                {selectedMessage.location.name || 'Location'}
                                {selectedMessage.location.address && ` - ${selectedMessage.location.address}`}
                                {(selectedMessage.location.lat || selectedMessage.location.long) && ` (${selectedMessage.location.lat || 'N/A'}, ${selectedMessage.location.long || 'N/A'})`}
                            </span>
                        </div>
                    )}
                    {selectedMessage.type === 'Template' && selectedMessage.template?.components.footer && (
                        <div style={{ padding: '0 12px 8px', fontSize: '0.75rem', color: '#666' }}>
                            {selectedMessage.template.components.footer.text}
                        </div>
                    )}
                    {(selectedMessage.buttons?.length > 0 || (selectedMessage.type === 'Template' && selectedMessage.template?.components.buttons?.length > 0)) && (
                        <div style={{ borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '8px' }}>
                            {(selectedMessage.buttons || selectedMessage.template?.components.buttons || []).map((button, index) => (
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
                        {selectedMessage.sentOn.split(' ')[1] || '2:03 PM'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageDetailPreview;