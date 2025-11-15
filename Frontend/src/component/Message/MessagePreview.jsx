import React from 'react';
import { Link, Phone, LocationOn, Person } from '@mui/icons-material';
import useMessageStore from '../../app/messageStore';

const MessagePreview = () => {
  const {
    messageType,
    selectedTemplate,
    text,
    mediaType,
    mediaFile,
    mediaFileUrl,
    sampleValues,
    interactiveType,
    buttons,
    locationLat,
    locationLong,
    locationName,
    locationAddress,
    contactFormattedName,
    contactFirstName,
    contactLastName,
    contactPhone,
    contactEmail,
    country,
  } = useMessageStore();

  const renderFormattedText = (txt, samples = {}) => {
    if (!txt || typeof txt !== 'string') {
      return <span>No content available</span>;
    }
    let formattedText = txt.replace(/{{[0-9]+}}/g, (match) => samples[match] || match);
    const parts = [];
    let currentIndex = 0;
    const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~|\{\{[0-9]+\}\})/g;
    let match;
    while ((match = regex.exec(formattedText)) !== null) {
      if (match.index > currentIndex) {
        parts.push({ type: 'text', content: formattedText.slice(currentIndex, match.index) });
      }
      const matchedText = match[0];
      if (matchedText.startsWith('{{') && matchedText.endsWith('}}')) {
        parts.push({ type: 'variable', content: samples[matchedText] || matchedText });
      } else {
        const content = matchedText.slice(1, -1);
        const type = matchedText.startsWith('*') ? 'bold' : matchedText.startsWith('_') ? 'italic' : 'strikethrough';
        parts.push({ type, content });
      }
      currentIndex = match.index + matchedText.length;
    }
    if (currentIndex < formattedText.length) {
      parts.push({ type: 'text', content: formattedText.slice(currentIndex) });
    }
    return parts.map((part, index) => {
      if (part.type === 'bold') {
        return <strong key={index}>{part.content}</strong>;
      } else if (part.type === 'italic') {
        return <em key={index}>{part.content}</em>;
      } else if (part.type === 'strikethrough') {
        return <s key={index}>{part.content}</s>;
      } else if (part.type === 'variable') {
        return (
          <span key={index} style={{ color: '#2563EB', fontWeight: '500', backgroundColor: '#EFF6FF', padding: '2px 4px', borderRadius: '4px' }}>
            {part.content}
          </span>
        );
      } else {
        return <span key={index}>{part.content}</span>;
      }
    });
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
        Message Preview
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
          {messageType === 'template' && selectedTemplate?.components.header && (
            selectedTemplate.components.header.format === 'TEXT' ? (
              <div style={{ padding: '8px 12px', fontWeight: 'bold', fontSize: '1rem', color: '#000' }}>
                {selectedTemplate.components.header.text}
              </div>
            ) : (
              <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                <span>{selectedTemplate.components.header.format}: (Preview not available)</span>
              </div>
            )
          )}
          {messageType === 'new' && mediaType !== 'none' && (
            <>
              {mediaType === 'image' && mediaFile && (
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  {mediaFile.type.startsWith('image/') ? (
                    <img
                      src={mediaFileUrl}
                      alt={mediaFile.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <span style={{ display: 'none' }}></span>
                  )}
                  <span style={{ display: mediaFile.type.startsWith('image/') ? 'none' : 'block', color: '#DC2626' }}>
                    Invalid image file: {mediaFile.name}
                  </span>
                </div>
              )}
              {mediaType === 'video' && mediaFile && (
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  {mediaFile.type.startsWith('video/') ? (
                    <video
                      controls
                      src={mediaFileUrl}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <span style={{ display: 'none' }}></span>
                  )}
                  <span style={{ display: mediaFile.type.startsWith('video/') ? 'none' : 'block', color: '#DC2626' }}>
                    Invalid video file: {mediaFile.name}
                  </span>
                </div>
              )}
              {mediaType === 'audio' && mediaFile && (
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  {mediaFile.type.startsWith('audio/') ? (
                    <audio
                      controls
                      src={mediaFileUrl}
                      style={{
                        width: '100%',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <span style={{ display: 'none' }}></span>
                  )}
                  <span style={{ display: mediaFile.type.startsWith('audio/') ? 'none' : 'block', color: '#DC2626' }}>
                    Invalid audio file: {mediaFile.name}
                  </span>
                </div>
              )}
              {mediaType === 'document' && mediaFile && (
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  {mediaFile.type === 'application/pdf' ? (
                    <iframe
                      src={mediaFileUrl}
                      title={mediaFile.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <span style={{ display: 'none' }}></span>
                  )}
                  <span style={{ display: mediaFile.type === 'application/pdf' ? 'none' : 'block', color: '#DC2626' }}>
                    Invalid document file: {mediaFile.name}
                  </span>
                </div>
              )}
              {mediaType === 'location' && (locationLat || locationLong || locationName || locationAddress) && (
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  <LocationOn style={{ fontSize: '24px', color: '#00A884', verticalAlign: 'middle', marginRight: '6px' }} />
                  <span>
                    {locationName || 'Location'}
                    {locationAddress && ` - ${locationAddress}`}
                    {(locationLat || locationLong) && ` (${locationLat || 'N/A'}, ${locationLong || 'N/A'})`}
                  </span>
                </div>
              )}
              {mediaType === 'contacts' && (contactFormattedName || contactFirstName || contactLastName || contactPhone || contactEmail || country) && (
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                  <Person style={{ fontSize: '24px', color: '#00A884', verticalAlign: 'middle', marginRight: '6px' }} />
                  <span>
                    {contactFormattedName || `${contactFirstName || ''} ${contactLastName || ''}`.trim() || 'Contact'}
                    {contactPhone && ` - ${contactPhone}`}
                    {contactEmail && ` - ${contactEmail}`}
                    {country && ` - ${country}`}
                  </span>
                </div>
              )}
            </>
          )}
          {(messageType === 'new' && text) || (messageType === 'template' && selectedTemplate?.components.body?.text) ? (
            <div style={{ padding: '8px 12px', fontSize: '0.875rem', color: '#000', whiteSpace: 'pre-wrap' }}>
              {renderFormattedText(
                messageType === 'new' ? text : selectedTemplate?.components.body?.text || '',
                messageType === 'new' ? sampleValues : selectedTemplate?.sampleValues || {}
              )}
            </div>
          ) : null}
          {messageType === 'template' && selectedTemplate?.components.footer && (
            <div style={{ padding: '0 12px 8px', fontSize: '0.75rem', color: '#666' }}>
              {selectedTemplate.components.footer.text}
            </div>
          )}
          {(messageType === 'new' && interactiveType === 'buttons' && buttons.length > 0) || (messageType === 'template' && selectedTemplate?.components.buttons?.length > 0) ? (
            <div style={{ borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '8px' }}>
              {(messageType === 'new' ? buttons : selectedTemplate?.components.buttons || []).map((button, index) => (
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
                  {button.text || 'Button'}
                </button>
              ))}
            </div>
          ) : null}
          <div style={{ position: 'absolute', bottom: '4px', right: '8px', fontSize: '0.6875rem', color: '#666' }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;