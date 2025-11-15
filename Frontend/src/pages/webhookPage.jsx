import React, { useState } from 'react';
import {
    CheckCircle,
    Error,
    History,
    Lock,
    Refresh,
    Send,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import Sidebar from '../component/sidebar';
import Header from '../component/header';

const WebhookPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('webhook');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [verifyToken, setVerifyToken] = useState('your_custom_token');
    const [showToken, setShowToken] = useState(false);
    const [subscribedEvents] = useState({
        messages: true,
        statuses: false,
        errors: false,
    });
    const [status, setStatus] = useState('Pending Verification');
    const [lastVerified, setLastVerified] = useState(null);
    const [error, setError] = useState('');
    const [recentEvents, setRecentEvents] = useState([
        { timestamp: '2025-08-28 10:12:34', type: 'messages', status: 'processed' },
        { timestamp: '2025-08-28 09:58:10', type: 'statuses', status: 'delivered' },
        { timestamp: '2025-08-28 09:45:01', type: 'messages', status: 'error 500' },
    ]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleRegenerateToken = () => {
        const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setVerifyToken(newToken);
        setShowToken(true);
    };

    const validateWebhookUrl = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleVerifySave = () => {
        if (!validateWebhookUrl(webhookUrl)) {
            setError('Webhook URL must be a valid HTTPS endpoint.');
            return;
        }
        if (!verifyToken) {
            setError('Verify Token is required.');
            return;
        }
        setError('');
        console.log('Configuring webhook:', {
            url: webhookUrl,
            verifyToken,
            subscribedEvents: Object.keys(subscribedEvents).filter((key) => subscribedEvents[key]),
        });
        setStatus('Verified');
        setLastVerified(new Date().toISOString());
    };

    const handleTestWebhook = () => {
        console.log('Sending test webhook to:', webhookUrl);
        const date = new Date();
        const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        setRecentEvents((prev) => [
            { timestamp: formattedTimestamp, type: 'test', status: 'sent' },
            ...prev.slice(0, 9),
        ]);
    };

    const getStatusIcon = () => {
        if (status === 'Verified') return <CheckCircle style={{ color: '#22C55E' }} />;
        if (status === 'Failed') return <Error style={{ color: '#EF4444' }} />;
        return <History style={{ color: '#EAB308' }} />;
    };

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeNavItem={activeNavItem}
                handleNavItemClick={handleNavItemClick}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header
                    activeNavItem={activeNavItem}
                    toggleSidebar={toggleSidebar}
                    userDropdownOpen={userDropdownOpen}
                    toggleUserDropdown={toggleUserDropdown}
                />
                <main style={{ flex: '1', overflowY: 'auto', backgroundColor: '#dde9f0', padding: '32px' }}>
                    <div style={{ maxWidth: '896px', margin: '0 auto', background: 'linear-gradient(145deg, #FFFFFF, #F9FAFB)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '32px', letterSpacing: '-0.025em' }}>
                            Webhook Configuration
                        </h2>

                        {error && (
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>
                                {error}
                                <p
                                    id="error-help"
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#DC2626',
                                        marginTop: '8px',
                                        fontWeight: '400',
                                    }}
                                >
                                    Please correct the errors above to proceed with webhook configuration.
                                </p>
                            </div>
                        )}

                        {/* Section 1: Webhook Endpoint Setup */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
                                Webhook Endpoint Setup
                            </h3>
                            <p
                                id="endpoint-setup-help"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    marginBottom: '16px',
                                    fontWeight: '400',
                                }}
                            >
                                Configure the endpoint where webhook events will be sent and the token used for verification.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Webhook URL
                                    </label>
                                    <input
                                        type="text"
                                        value={webhookUrl}
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                        style={{
                                            width: '100%',
                                            border: error.includes('Webhook URL') ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                            outline: 'none',
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                            fontSize: '0.875rem',
                                            backgroundColor: '#FFFFFF',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#2563EB';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = error.includes('Webhook URL') ? '#DC2626' : '#D1D5DB';
                                            e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                                        }}
                                        placeholder="https://your-endpoint.com/webhook"
                                        aria-describedby={error.includes('Webhook URL') ? 'webhook-url-error' : 'webhook-url-help'}
                                        aria-invalid={!!error.includes('Webhook URL')}
                                    />
                                    <p
                                        id="webhook-url-help"
                                        style={{
                                            fontSize: '0.75rem',
                                            color: '#6B7280',
                                            marginTop: '8px',
                                            fontWeight: '400',
                                        }}
                                    >
                                        Enter a valid HTTPS URL where webhook events will be sent. Must use a secure connection.
                                    </p>
                                    {error.includes('Webhook URL') && (
                                        <p
                                            id="webhook-url-error"
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
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Verify Token
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showToken ? 'text' : 'password'}
                                            value={verifyToken}
                                            onChange={(e) => setVerifyToken(e.target.value)}
                                            style={{
                                                width: '100%',
                                                border: error.includes('Verify Token') ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                                borderRadius: '8px',
                                                padding: '12px 40px 12px 12px',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                                outline: 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                                fontSize: '0.875rem',
                                                backgroundColor: '#FFFFFF',
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#2563EB';
                                                e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = error.includes('Verify Token') ? '#DC2626' : '#D1D5DB';
                                                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                                            }}
                                            aria-describedby={error.includes('Verify Token') ? 'verify-token-error' : 'verify-token-help'}
                                            aria-invalid={!!error.includes('Verify Token')}
                                        />
                                        <Tooltip title={showToken ? 'Hide' : 'Show'} arrow>
                                            <IconButton
                                                onClick={() => setShowToken(!showToken)}
                                                style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)' }}
                                            >
                                                {showToken ? <VisibilityOff style={{ fontSize: '20px', color: '#2563EB' }} /> : <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Regenerate" arrow>
                                            <IconButton
                                                onClick={handleRegenerateToken}
                                                style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}
                                            >
                                                <Refresh style={{ fontSize: '20px', color: '#2563EB' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <p
                                        id="verify-token-help"
                                        style={{
                                            fontSize: '0.75rem',
                                            color: '#6B7280',
                                            marginTop: '8px',
                                            fontWeight: '400',
                                        }}
                                    >
                                        A unique token used to verify the webhook endpoint. Click the refresh icon to generate a new token.
                                    </p>
                                    {error.includes('Verify Token') && (
                                        <p
                                            id="verify-token-error"
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
                            </div>
                            <button
                                onClick={handleVerifySave}
                                style={{
                                    marginTop: '16px',
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
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#1D4ED8';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#2563EB';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                <Send style={{ fontSize: '16px' }} />
                                Verify & Save
                            </button>
                            <p
                                id="verify-save-help"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    marginTop: '8px',
                                    fontWeight: '400',
                                }}
                            >
                                Click to verify the webhook URL and save the configuration. Ensure the endpoint is accessible.
                            </p>
                        </div>

                        {/* Section 2: Webhook Status & Validation */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
                                Webhook Status & Validation
                            </h3>
                            <p
                                id="status-validation-help"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    marginBottom: '16px',
                                    fontWeight: '400',
                                }}
                            >
                                Check the current status of your webhook and test its functionality.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Status: {getStatusIcon()} <span style={{ fontWeight: '500' }}>{status}</span>
                                </div>
                                {lastVerified && (
                                    <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        Last Verified: {formatTimestamp(lastVerified)}
                                    </div>
                                )}
                                <button
                                    onClick={handleTestWebhook}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid #2563EB',
                                        borderRadius: '8px',
                                        backgroundColor: '#EFF6FF',
                                        color: '#2563EB',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s, transform 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#DBEAFE';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#EFF6FF';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    Test Webhook
                                </button>
                            </div>
                            <p
                                id="test-webhook-help"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    marginTop: '8px',
                                    fontWeight: '400',
                                }}
                            >
                                Click to send a test event to the webhook URL to verify it is working correctly.
                            </p>
                        </div>

                        {/* Section 3: Recent Webhook Events & Logs */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
                                Recent Webhook Events (most recent first)
                            </h3>
                            <p
                                id="recent-events-help"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    marginBottom: '16px',
                                    fontWeight: '400',
                                }}
                            >
                                View the most recent webhook events, including their type and status.
                            </p>
                            <div style={{ backgroundColor: '#F3F4F6', padding: '16px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }} className="no-scrollbar">
                                {recentEvents.length === 0 ? (
                                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>No recent events.</p>
                                ) : (
                                    recentEvents.map((event, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', color: '#374151' }}>
                                            <span>{event.timestamp} | {event.type}</span>
                                            <span style={{ fontWeight: '500', color: event.status.startsWith('error') ? '#DC2626' : '#22C55E' }}>{event.status}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Section 4: Security & Verification Details */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB' }}>
                                Security & Verification Details
                            </h3>
                            <p
                                id="security-verification-help"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    marginBottom: '12px',
                                    fontWeight: '400',
                                }}
                            >
                                Ensure your webhook endpoint is secure and properly configured for verification.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Lock style={{ fontSize: '20px', color: '#2563EB' }} />
                                <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                                    Your endpoint must verify the `hub.verify_token` and respond with `hub.challenge` during setup.
                                </p>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '12px' }}>
                                Ensure your server uses HTTPS with a valid SSL certificate (no self-signed). Consider validating HMAC signatures for added security.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WebhookPage;