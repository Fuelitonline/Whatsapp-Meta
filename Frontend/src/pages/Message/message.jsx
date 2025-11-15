import React, { useRef } from 'react';
import {
  Person,
  Group,
  UploadFile,
  Image,
  VideoFile,
  Audiotrack,
  LocationOn,
  Send,
  Clear,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  AddCircleOutline,
  Link,
  Phone,
} from '@mui/icons-material';
import { IconButton, Tooltip, Button } from '@mui/material';
import Sidebar from '../../component/sidebar';
import Header from '../../component/header';
import MessagePreview from '../../component/Message/MessagePreview';
import useMessageStore from '../../app/messageStore';

// Mock templates for selection
const mockTemplates = [
  {
    id: '1',
    name: 'order_confirmation',
    category: 'UTILITY',
    language: 'en_US',
    status: 'APPROVED',
    components: {
      header: { format: 'TEXT', text: 'Order Confirmation' },
      body: { text: 'Hi *{{1}}*, your order _{{2}}_ is ~confirmed~.' },
      footer: { text: 'Thank you for shopping!' },
      buttons: [{ type: 'URL', text: 'View Order', url: 'https://example.com/order/{{2}}' }],
    },
    sampleValues: { '{{1}}': 'John', '{{2}}': '12345' },
  },
  {
    id: '2',
    name: 'discount_offer',
    category: 'MARKETING',
    language: 'en_GB',
    status: 'APPROVED',
    components: {
      body: { text: 'Get *20% off* your next purchase, {{1}}! Click below.' },
      buttons: [{ type: 'URL', text: 'Claim Offer', url: 'https://example.com/discount' }],
    },
    sampleValues: { '{{1}}': 'Alice' },
  },
];

const Message = () => {
  const textareaRef = useRef(null);
  const {
    sidebarOpen,
    userDropdownOpen,
    activeNavItem,
    recipientType,
    phoneNumber,
    group,
    bulkFile,
    messageType,
    selectedTemplate,
    text,
    mediaType,
    interactiveType,
    buttons,
    sendNow,
    scheduleDate,
    scheduleTime,
    repeat,
    error,
    sampleValues,
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
    toggleSidebar,
    toggleUserDropdown,
    setActiveNavItem,
    setRecipientType,
    setPhoneNumber,
    setGroup,
    setBulkFile,
    setMessageType,
    setSelectedTemplate,
    setText,
    setMediaType,
    setMediaFile,
    setInteractiveType,
    addButton,
    removeButton,
    updateButton,
    setSendNow,
    setScheduleDate,
    setScheduleTime,
    setRepeat,
    addVariable,
    setSampleValue,
    setLocationLat,
    setLocationLong,
    setLocationName,
    setLocationAddress,
    setContactFormattedName,
    setContactFirstName,
    setContactLastName,
    setContactPhone,
    setContactEmail,
    setCountry,
    clearForm,
    submit,
  } = useMessageStore();

  const applyFormatting = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = text;
    let newText = currentText;
    let newCursorPos = end;
    if (start === end) {
      const marker = format === 'bold' ? '**' : format === 'italic' ? '__' : '~~';
      newText = currentText.substring(0, start) + marker + marker + currentText.substring(end);
      newCursorPos = start + marker.length;
    } else {
      const selectedText = currentText.substring(start, end);
      const marker = format === 'bold' ? '*' : format === 'italic' ? '_' : '~';
      newText = currentText.substring(0, start) + marker + selectedText + marker + currentText.substring(end);
      newCursorPos = end + marker.length * 2;
    }
    setText(newText);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  const handleTemplateChange = (e) => {
    const selected = mockTemplates.find((t) => t.id === e.target.value) || null;
    setSelectedTemplate(selected);
    if (selected) {
      Object.keys(selected.sampleValues).forEach((variable) => {
        setSampleValue(variable, selected.sampleValues[variable] || '');
      });
    } else {
      setSampleValue({});
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={toggleSidebar}
        activeNavItem={activeNavItem}
        handleNavItemClick={setActiveNavItem}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header
          activeNavItem={activeNavItem}
          toggleSidebar={toggleSidebar}
          userDropdownOpen={userDropdownOpen}
          toggleUserDropdown={toggleUserDropdown}
        />
        <main style={{ flex: '1', overflowY: 'auto', backgroundColor: '#dde9f0', padding: '32px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '32px', letterSpacing: '-0.025em' }}>
              Send Message
            </h2>
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: '32px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                  Recipient Type
                </h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="single"
                      checked={recipientType === 'single'}
                      onChange={() => setRecipientType('single')}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Select single recipient"
                    />
                    Single
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="group"
                      checked={recipientType === 'group'}
                      onChange={() => setRecipientType('group')}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Select group recipient"
                    />
                    Group
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="bulk"
                      checked={recipientType === 'bulk'}
                      onChange={() => setRecipientType('bulk')}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Select bulk recipient"
                    />
                    Bulk
                  </label>
                </div>
                <p
                  id="recipient-type-help"
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginTop: '8px',
                    fontWeight: '400',
                  }}
                >
                  Choose the recipient type for your message. Single sends to one phone number, Group sends to a predefined group, and Bulk sends to multiple recipients via a CSV file.
                </p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                  Recipients
                </h4>
                {recipientType === 'single' && (
                  <div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: error && recipientType === 'single' ? '1px solid #DC2626' : '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Enter phone number"
                      aria-describedby={error && recipientType === 'single' ? 'phone-number-error' : 'phone-number-help'}
                      aria-invalid={!!(error && recipientType === 'single')}
                    />
                    <p
                      id="phone-number-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter a valid phone number with country code (e.g., +1234567890). Required for single recipient messages.
                    </p>
                    {error && recipientType === 'single' && (
                      <p
                        id="phone-number-error"
                        style={{
                          fontSize: '0.75rem',
                          color: '#DC2626',
                          marginTop: '4px',
                          fontWeight: '400',
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                )}
                {recipientType === 'group' && (
                  <div>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: error && recipientType === 'group' ? '1px solid #DC2626' : '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Select group"
                      aria-describedby={error && recipientType === 'group' ? 'group-error' : 'group-help'}
                      aria-invalid={!!(error && recipientType === 'group')}
                    >
                      <option value="">Select group</option>
                      <option value="group1">Group 1</option>
                      <option value="group2">Group 2</option>
                    </select>
                    <p
                      id="group-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Select a predefined group of recipients to send the message to. Required for group messages.
                    </p>
                    {error && recipientType === 'group' && (
                      <p
                        id="group-error"
                        style={{
                          fontSize: '0.75rem',
                          color: '#DC2626',
                          marginTop: '4px',
                          fontWeight: '400',
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                )}
                {recipientType === 'bulk' && (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setBulkFile(e.target.files[0])}
                        style={{
                          padding: '12px',
                          border: error && recipientType === 'bulk' ? '1px solid #DC2626' : '1px solid #D1D5DB',
                          borderRadius: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          backgroundColor: '#FFFFFF',
                        }}
                        aria-label="Upload CSV file"
                        aria-describedby={error && recipientType === 'bulk' ? 'bulk-file-error' : 'bulk-file-help'}
                        aria-invalid={!!(error && recipientType === 'bulk')}
                      />
                      {bulkFile && (
                        <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                          Uploaded: {bulkFile.name}
                        </div>
                      )}
                    </div>
                    <p
                      id="bulk-file-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Upload a CSV file containing phone numbers for bulk messaging. Required for bulk recipient messages.
                    </p>
                    {error && recipientType === 'bulk' && (
                      <p
                        id="bulk-file-error"
                        style={{
                          fontSize: '0.75rem',
                          color: '#DC2626',
                          marginTop: '4px',
                          fontWeight: '400',
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                  Message Type
                </h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="new"
                      checked={messageType === 'new'}
                      onChange={() => setMessageType('new')}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Select new message"
                    />
                    New Message
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="template"
                      checked={messageType === 'template'}
                      onChange={() => setMessageType('template')}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Select template message"
                    />
                    Template
                  </label>
                </div>
                <p
                  id="message-type-help"
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginTop: '8px',
                    fontWeight: '400',
                  }}
                >
                  Choose whether to create a new custom message or use a pre-approved template.
                </p>
              </div>
              {messageType === 'template' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Select Template
                  </h4>
                  <select
                    value={selectedTemplate?.id || ''}
                    onChange={handleTemplateChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: error && messageType === 'template' ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                    }}
                    aria-label="Select template"
                    aria-describedby={error && messageType === 'template' ? 'template-error' : 'template-help'}
                    aria-invalid={!!(error && messageType === 'template')}
                  >
                    <option value="">Select template</option>
                    {mockTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} ({template.category} - {template.language})
                      </option>
                    ))}
                  </select>
                  <p
                    id="template-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Select a pre-approved template for your message. Required for template-based messages.
                  </p>
                  {error && messageType === 'template' && (
                    <p
                      id="template-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {error}
                    </p>
                  )}
                  {selectedTemplate && (
                    <div style={{ marginTop: '16px' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
                        Template Sample Values
                      </h5>
                      <p
                        id="sample-values-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginBottom: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Provide sample values for template variables to preview the message accurately.
                      </p>
                      {Object.keys(selectedTemplate.sampleValues).map((variable) => (
                        <div key={variable} style={{ marginBottom: '12px' }}>
                          <label style={{ fontSize: '0.875rem', color: '#111827' }}>{variable}:</label>
                          <input
                            type="text"
                            value={sampleValues[variable] || ''}
                            onChange={(e) => setSampleValue(variable, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '8px',
                              outline: 'none',
                              marginTop: '4px',
                            }}
                            aria-label={`Sample value for ${variable}`}
                            aria-describedby={`sample-value-${variable}-help`}
                          />
                          <p
                            id={`sample-value-${variable}-help`}
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginTop: '4px',
                              fontWeight: '400',
                            }}
                          >
                            Enter a sample value for {variable} to preview how it will appear in the message.
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {messageType === 'new' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Text
                  </h4>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text message"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: error && messageType === 'new' && !text && mediaType === 'none' && interactiveType === 'none' ? '1px solid #DC2626' : '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        minHeight: '120px',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Enter text message"
                      aria-describedby={error && messageType === 'new' && !text && mediaType === 'none' && interactiveType === 'none' ? 'text-error' : 'text-help'}
                      aria-invalid={!!(error && messageType === 'new' && !text && mediaType === 'none' && interactiveType === 'none')}
                    />
                    <p
                      id="text-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the message text. Use formatting buttons for bold (*text*), italic (_text_), or strikethrough (~text~). Add variables like {'{{1}}'} for dynamic content.
                    </p>
                    {error && messageType === 'new' && !text && mediaType === 'none' && interactiveType === 'none' && (
                      <p
                        id="text-error"
                        style={{
                          fontSize: '0.75rem',
                          color: '#DC2626',
                          marginTop: '4px',
                          fontWeight: '400',
                        }}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <Tooltip title="Bold">
                      <IconButton onClick={() => applyFormatting('bold')} style={{ color: '#111827' }}>
                        <FormatBold />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                      <IconButton onClick={() => applyFormatting('italic')} style={{ color: '#111827' }}>
                        <FormatItalic />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Strikethrough">
                      <IconButton onClick={() => applyFormatting('strikethrough')} style={{ color: '#111827' }}>
                        <FormatUnderlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Variable">
                      <IconButton onClick={addVariable} style={{ color: '#111827' }}>
                        <AddCircleOutline />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <p
                    id="formatting-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Use buttons to apply bold, italic, or strikethrough formatting, or add variables to insert dynamic content like names or order IDs.
                  </p>
                  {Object.keys(sampleValues).length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
                        Sample Values
                      </h5>
                      <p
                        id="sample-values-help"
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginBottom: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Provide sample values for variables to preview how they will appear in the message.
                      </p>
                      {Object.keys(sampleValues).map((variable) => (
                        <div key={variable} style={{ marginBottom: '12px' }}>
                          <label style={{ fontSize: '0.875rem', color: '#111827' }}>{variable}:</label>
                          <input
                            type="text"
                            value={sampleValues[variable] || ''}
                            onChange={(e) => setSampleValue(variable, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #D1D5DB',
                              borderRadius: '8px',
                              outline: 'none',
                              marginTop: '4px',
                            }}
                            aria-label={`Sample value for ${variable}`}
                            aria-describedby={`sample-value-${variable}-help`}
                          />
                          <p
                            id={`sample-value-${variable}-help`}
                            style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginTop: '4px',
                              fontWeight: '400',
                            }}
                          >
                            Enter a sample value for {variable} to preview how it will appear in the message.
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {messageType === 'new' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Media Type
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="none"
                        checked={mediaType === 'none'}
                        onChange={() => setMediaType('none')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="No media"
                      />
                      None
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="image"
                        checked={mediaType === 'image'}
                        onChange={() => setMediaType('image')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Image media"
                      />
                      Image
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="video"
                        checked={mediaType === 'video'}
                        onChange={() => setMediaType('video')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Video media"
                      />
                      Video
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="audio"
                        checked={mediaType === 'audio'}
                        onChange={() => setMediaType('audio')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Audio media"
                      />
                      Audio
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="document"
                        checked={mediaType === 'document'}
                        onChange={() => setMediaType('document')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Document media"
                      />
                      Document
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="location"
                        checked={mediaType === 'location'}
                        onChange={() => setMediaType('location')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Location media"
                      />
                      Location
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="contacts"
                        checked={mediaType === 'contacts'}
                        onChange={() => setMediaType('contacts')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Contacts media"
                      />
                      Contacts
                    </label>
                  </div>
                  <p
                    id="media-type-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Select the type of media to include in your message, such as images, videos, audio, documents, locations, or contacts.
                  </p>
                </div>
              )}
              {messageType === 'new' && mediaType !== 'none' && mediaType !== 'location' && mediaType !== 'contacts' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Media File
                  </h4>
                  <input
                    type="file"
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    accept={mediaType === 'image' ? 'image/*' : mediaType === 'video' ? 'video/*' : mediaType === 'audio' ? 'audio/*' : 'application/pdf'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      backgroundColor: '#FFFFFF',
                    }}
                    aria-label="Upload media file"
                    aria-describedby="media-file-help"
                  />
                  <p
                    id="media-file-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Upload a file for the selected media type (e.g., image, video, audio, or PDF document). Ensure the file format is supported.
                  </p>
                </div>
              )}
              {messageType === 'new' && mediaType === 'location' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Location
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={locationLat}
                      onChange={(e) => setLocationLat(e.target.value)}
                      placeholder="Latitude"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Enter latitude"
                      aria-describedby="latitude-help"
                    />
                    <p
                      id="latitude-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the latitude coordinate for the location (e.g., 40.7128).
                    </p>
                    <input
                      type="text"
                      value={locationLong}
                      onChange={(e) => setLocationLong(e.target.value)}
                      placeholder="Longitude"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Enter longitude"
                      aria-describedby="longitude-help"
                    />
                    <p
                      id="longitude-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the longitude coordinate for the location (e.g., -74.0060).
                    </p>
                  </div>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Name (optional)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '12px',
                    }}
                    aria-label="Enter location name"
                    aria-describedby="location-name-help"
                  />
                  <p
                    id="location-name-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter an optional name for the location (e.g., Store Name).
                  </p>
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="Address (optional)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                    }}
                    aria-label="Enter location address"
                    aria-describedby="location-address-help"
                  />
                  <p
                    id="location-address-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter an optional address for the location (e.g., 123 Main St).
                  </p>
                </div>
              )}
              {messageType === 'new' && mediaType === 'contacts' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Contacts
                  </h4>
                  <input
                    type="text"
                    value={contactFormattedName}
                    onChange={(e) => setContactFormattedName(e.target.value)}
                    placeholder="Formatted Name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '12px',
                    }}
                    aria-label="Enter formatted name"
                    aria-describedby="contact-formatted-name-help"
                  />
                  <p
                    id="contact-formatted-name-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the full name as it should appear in the contact card (e.g., John Doe).
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                      placeholder="First Name"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Enter first name"
                      aria-describedby="contact-first-name-help"
                    />
                    <p
                      id="contact-first-name-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the contact's first name (e.g., John).
                    </p>
                    <input
                      type="text"
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                      placeholder="Last Name"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Enter last name"
                      aria-describedby="contact-last-name-help"
                    />
                    <p
                      id="contact-last-name-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Enter the contact's last name (e.g., Doe).
                    </p>
                  </div>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: error && contactPhone && !/^\+?[1-9]\d{0,15}$/.test(contactPhone.replace(/[\s\-()]/g, '')) ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '12px',
                    }}
                    aria-label="Enter contact phone number"
                    aria-describedby={error && contactPhone && !/^\+?[1-9]\d{0,15}$/.test(contactPhone.replace(/[\s\-()]/g, '')) ? 'contact-phone-error' : 'contact-phone-help'}
                    aria-invalid={!!(error && contactPhone && !/^\+?[1-9]\d{0,15}$/.test(contactPhone.replace(/[\s\-()]/g, '')))}
                  />
                  <p
                    id="contact-phone-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the contact's phone number with country code (e.g., +1234567890).
                  </p>
                  {error && contactPhone && !/^\+?[1-9]\d{0,15}$/.test(contactPhone.replace(/[\s\-()]/g, '')) && (
                    <p
                      id="contact-phone-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {error}
                    </p>
                  )}
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: error && contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? '1px solid #DC2626' : '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '12px',
                    }}
                    aria-label="Enter contact email"
                    aria-describedby={error && contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? 'contact-email-error' : 'contact-email-help'}
                    aria-invalid={!!(error && contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))}
                  />
                  <p
                    id="contact-email-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the contact's email address (e.g., example@domain.com).
                  </p>
                  {error && contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) && (
                    <p
                      id="contact-email-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {error}
                    </p>
                  )}
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                    }}
                    aria-label="Enter country"
                    aria-describedby="country-help"
                  />
                  <p
                    id="country-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Enter the contact's country (e.g., United States).
                  </p>
                </div>
              )}
              {messageType === 'new' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Interactive Type
                  </h4>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="none"
                        checked={interactiveType === 'none'}
                        onChange={() => setInteractiveType('none')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="No interactive type"
                      />
                      None
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="buttons"
                        checked={interactiveType === 'buttons'}
                        onChange={() => setInteractiveType('buttons')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Buttons interactive type"
                      />
                      Buttons
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                      <input
                        type="radio"
                        value="address"
                        checked={interactiveType === 'address'}
                        onChange={() => setInteractiveType('address')}
                        style={{ accentColor: '#2563EB' }}
                        aria-label="Address interactive type"
                      />
                      Address
                    </label>
                  </div>
                  <p
                    id="interactive-type-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Select an interactive element to include, such as buttons for URLs or phone calls, or an address form.
                  </p>
                </div>
              )}
              {messageType === 'new' && interactiveType === 'buttons' && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Buttons
                  </h4>
                  <p
                    id="buttons-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginBottom: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Add interactive buttons (up to 3) for URLs or phone calls to enhance user engagement.
                  </p>
                  {buttons.map((button, index) => (
                    <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                      <select
                        value={button.type}
                        onChange={(e) => updateButton(index, 'type', e.target.value)}
                        style={{
                          padding: '12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          outline: 'none',
                          fontSize: '0.875rem',
                          backgroundColor: '#FFFFFF',
                        }}
                        aria-label="Select button type"
                        aria-describedby={`button-type-${index}-help`}
                      >
                        <option value="URL">URL</option>
                        <option value="CALL">Call</option>
                      </select>
                      <p
                        id={`button-type-${index}-help`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Choose whether the button links to a URL or initiates a phone call.
                      </p>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => updateButton(index, 'text', e.target.value)}
                        placeholder="Button Text"
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          outline: 'none',
                          fontSize: '0.875rem',
                          backgroundColor: '#FFFFFF',
                        }}
                        aria-label="Enter button text"
                        aria-describedby={`button-text-${index}-help`}
                      />
                      <p
                        id={`button-text-${index}-help`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        Enter the text to display on the button (e.g., "Visit Website").
                      </p>
                      <input
                        type="text"
                        value={button.type === 'URL' ? button.url : button.phone}
                        onChange={(e) => updateButton(index, button.type === 'URL' ? 'url' : 'phone', e.target.value)}
                        placeholder={button.type === 'URL' ? 'URL' : 'Phone Number'}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          outline: 'none',
                          fontSize: '0.875rem',
                          backgroundColor: '#FFFFFF',
                        }}
                        aria-label={button.type === 'URL' ? 'Enter button URL' : 'Enter button phone number'}
                        aria-describedby={`button-${button.type === 'URL' ? 'url' : 'phone'}-${index}-help`}
                      />
                      <p
                        id={`button-${button.type === 'URL' ? 'url' : 'phone'}-${index}-help`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '8px',
                          fontWeight: '400',
                        }}
                      >
                        {button.type === 'URL' ? 'Enter the URL for the button (e.g., https://example.com).' : 'Enter the phone number for the button (e.g., +1234567890).'}
                      </p>
                      <IconButton onClick={() => removeButton(index)} style={{ color: '#DC2626' }}>
                        <Clear />
                      </IconButton>
                    </div>
                  ))}
                  <Button
                    onClick={addButton}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    aria-label="Add new button"
                  >
                    <AddCircleOutline style={{ fontSize: '16px' }} />
                    Add Button
                  </Button>
                </div>
              )}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                  Send Now / Schedule
                </h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="now"
                      checked={sendNow}
                      onChange={() => setSendNow(true)}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Send now"
                    />
                    Send Now
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="radio"
                      value="schedule"
                      checked={!sendNow}
                      onChange={() => setSendNow(false)}
                      style={{ accentColor: '#2563EB' }}
                      aria-label="Schedule message"
                    />
                    Schedule
                  </label>
                </div>
                <p
                  id="send-schedule-help"
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginTop: '8px',
                    fontWeight: '400',
                  }}
                >
                  Choose to send the message immediately or schedule it for a later time.
                </p>
              </div>
              {!sendNow && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '12px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                    Schedule
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: error && !sendNow ? '1px solid #DC2626' : '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Select schedule date"
                      aria-describedby={error && !sendNow ? 'schedule-date-error' : 'schedule-date-help'}
                      aria-invalid={!!(error && !sendNow)}
                    />
                    <p
                      id="schedule-date-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Select the date to schedule the message (e.g., YYYY-MM-DD).
                    </p>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: error && !sendNow ? '1px solid #DC2626' : '1px solid #D1D5DB',
                        borderRadius: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '0.875rem',
                        backgroundColor: '#FFFFFF',
                      }}
                      aria-label="Select schedule time"
                      aria-describedby={error && !sendNow ? 'schedule-time-error' : 'schedule-time-help'}
                      aria-invalid={!!(error && !sendNow)}
                    />
                    <p
                      id="schedule-time-help"
                      style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    >
                      Select the time to schedule the message (e.g., HH:MM).
                    </p>
                  </div>
                  {error && !sendNow && (
                    <p
                      id="schedule-error"
                      style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        marginTop: '4px',
                        fontWeight: '400',
                      }}
                    >
                      {error}
                    </p>
                  )}
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      outline: 'none',
                      fontSize: '0.875rem',
                      backgroundColor: '#FFFFFF',
                    }}
                    aria-label="Select repeat option"
                    aria-describedby="repeat-help"
                  >
                    <option value="none">No Repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p
                    id="repeat-help"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginTop: '8px',
                      fontWeight: '400',
                    }}
                  >
                    Choose if the scheduled message should repeat daily, weekly, or monthly.
                  </p>
                </div>
              )}
              <MessagePreview />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                <Button
                  onClick={clearForm}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #DC2626',
                    borderRadius: '8px',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  aria-label="Clear form"
                >
                  <Clear style={{ fontSize: '16px' }} />
                  Clear Form
                </Button>
                <Button
                  onClick={submit}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  aria-label="Submit message"
                >
                  <Send style={{ fontSize: '16px' }} />
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Message;