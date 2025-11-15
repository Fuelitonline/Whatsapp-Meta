import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpward,
    ArrowDownward,
    CheckCircle,
    HourglassEmpty,
    Cancel,
    PauseCircleOutline,
    Visibility,
    Edit,
    Delete,
} from '@mui/icons-material';
import { IconButton, Tooltip, Button } from '@mui/material';
import Sidebar from '../../component/sidebar';
import Header from '../../component/header';
import MessageDetailPreview from '../../component/Message/MessageDetailPreview';

// Mock message log
const initialMessageLog = [
    {
        id: '1',
        recipientType: 'single',
        recipients: '+16505551234',
        type: 'Text',
        status: 'DELIVERED',
        sentOn: '2025-08-22 14:30',
        scheduled: false,
        text: 'Hi *John*, your order is confirmed.',
        mediaType: 'none',
        mediaFile: null,
        interactiveType: 'none',
        buttons: [],
        sampleValues: {},
    },
    {
        id: '2',
        recipientType: 'bulk',
        recipients: 'Bulk (50 users)',
        type: 'Template',
        status: 'SENT',
        sentOn: '2025-08-21 10:15',
        scheduled: true,
        scheduledTime: '2025-08-21 10:00',
        template: {
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
    },
    {
        id: '3',
        recipientType: 'single',
        recipients: '+16505551234',
        type: 'Location',
        status: 'DELIVERED',
        sentOn: '2025-08-23 15:00',
        scheduled: false,
        text: '',
        mediaType: 'location',
        location: { lat: '37.44216251868683', long: '-122.16153582049394', name: 'Philz Coffee', address: '101 Forest Ave, Palo Alto, CA 94301' },
        interactiveType: 'none',
        buttons: [],
        sampleValues: {},
    },
];

const ViewMessage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('view message');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('NEWEST');
    const [sortDirection, setSortDirection] = useState('desc');
    const [messageLog] = useState(initialMessageLog);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const itemsPerPage = 5;

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleSort = (option) => {
        if (sortOption === option) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOption(option);
            setSortDirection(option === 'ALPHABETICAL' ? 'asc' : 'desc');
        }
    };

    const sortedLog = messageLog.sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        if (sortOption === 'NEWEST' || sortOption === 'OLDEST') {
            return direction * (new Date(b.sentOn) - new Date(a.sentOn));
        } else {
            return direction * a.recipients.localeCompare(b.recipients);
        }
    });

    const totalPages = Math.ceil(sortedLog.length / itemsPerPage);
    const paginatedLog = sortedLog.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    const handleView = (message) => {
        setSelectedMessage(message);
    };

    const handleEdit = (message) => {
        console.log(`Edit message: ${message.id}`);
        // Replace with logic to edit message
    };

    const handleDelete = (message) => {
        console.log(`Delete message: ${message.id}`);
        // Replace with API call to delete message
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
            <style>
                {`
                    @media (max-width: 768px) {
                        .message-table {
                            display: none;
                        }
                        .message-card-container {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        }
                        .message-card {
                            background: linear-gradient(145deg, #FFFFFF, #F9FAFB);
                            border: 1px solid #E5E7EB;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                            transition: transform 0.2s, box-shadow 0.2s;
                        }
                        .message-card:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
                        }
                        .message-card div {
                            margin-bottom: 12px;
                            font-size: 0.875rem;
                        }
                        .message-card div:last-child {
                            margin-bottom: 0;
                        }
                    }
                    @media (min-width: 769px) {
                        .message-card-container {
                            display: none;
                        }
                    }
                    .preview-panel {
                        transform: translateX(100%);
                        animation: slideIn 0.3s forwards;
                    }
                    @keyframes slideIn {
                        to { transform: translateX(0); }
                    }
                    .table-container {
                        background: linear-gradient(145deg, #FFFFFF, #F9FAFB);
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        overflow: hidden;
                        border: 1px solid #E5E7EB;
                    }
                    .message-table th {
                        position: relative;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .message-table th:hover {
                        background-color: #DBEAFE !important;
                    }
                    .sort-icon {
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
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
                    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1F2937', marginBottom: '32px', letterSpacing: '-0.025em' }}>
                            View Messages
                        </h2>

                        {/* Sort */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Tooltip title="Sort by Newest/Oldest">
                                    <Button
                                        onClick={() => handleSort('NEWEST')}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '10px',
                                            backgroundColor: sortOption === 'NEWEST' ? '#EFF6FF' : '#FFFFFF',
                                            color: '#111827',
                                            minWidth: 'unset',
                                        }}
                                    >
                                        Date {sortOption === 'NEWEST' && (sortDirection === 'desc' ? <ArrowDownward style={{ fontSize: '16px' }} /> : <ArrowUpward style={{ fontSize: '16px' }} />)}
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Sort Alphabetically">
                                    <Button
                                        onClick={() => handleSort('ALPHABETICAL')}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '10px',
                                            backgroundColor: sortOption === 'ALPHABETICAL' ? '#EFF6FF' : '#FFFFFF',
                                            color: '#111827',
                                            minWidth: 'unset',
                                        }}
                                    >
                                        Recipients {sortOption === 'ALPHABETICAL' && (sortDirection === 'asc' ? <ArrowUpward style={{ fontSize: '16px' }} /> : <ArrowDownward style={{ fontSize: '16px' }} />)}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Message Log Table (Desktop) */}
                        <div className="table-container" style={{ marginBottom: '32px' }}>
                            <table className="message-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(90deg, #F3F4F6, #E5E7EB)' }}>
                                        <th
                                            onClick={() => handleSort('ALPHABETICAL')}
                                            style={{
                                                padding: '16px',
                                                textAlign: 'left',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#1F2937',
                                                borderBottom: '2px solid #D1D5DB',
                                                width: '25%',
                                                backgroundColor: sortOption === 'ALPHABETICAL' ? '#DBEAFE' : 'transparent',
                                                position: 'relative',
                                            }}
                                        >
                                            Recipients
                                            {sortOption === 'ALPHABETICAL' && (
                                                <span className="sort-icon">
                                                    {sortDirection === 'asc' ? <ArrowUpward style={{ fontSize: '16px', color: '#2563EB' }} /> : <ArrowDownward style={{ fontSize: '16px', color: '#2563EB' }} />}
                                                </span>
                                            )}
                                        </th>
                                        <th style={{
                                            padding: '16px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '20%',
                                        }}>
                                            Type
                                        </th>
                                        <th style={{
                                            padding: '16px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '20%',
                                        }}>
                                            Status
                                        </th>
                                        <th
                                            onClick={() => handleSort('NEWEST')}
                                            style={{
                                                padding: '16px',
                                                textAlign: 'left',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#1F2937',
                                                borderBottom: '2px solid #D1D5DB',
                                                width: '20%',
                                                backgroundColor: sortOption === 'NEWEST' || sortOption === 'OLDEST' ? '#DBEAFE' : 'transparent',
                                                position: 'relative',
                                            }}
                                        >
                                            Sent On
                                            {(sortOption === 'NEWEST' || sortOption === 'OLDEST') && (
                                                <span className="sort-icon">
                                                    {sortDirection === 'asc' ? <ArrowUpward style={{ fontSize: '16px', color: '#2563EB' }} /> : <ArrowDownward style={{ fontSize: '16px', color: '#2563EB' }} />}
                                                </span>
                                            )}
                                        </th>
                                        <th style={{
                                            padding: '16px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '15%',
                                        }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLog.map((message, index) => (
                                        <tr
                                            key={message.id}
                                            style={{
                                                background: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                                                transition: 'background-color 0.2s, transform 0.2s',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(90deg, #EFF6FF, #DBEAFE)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{message.recipients}</td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827' }}>{message.type}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '16px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#FFFFFF',
                                                        backgroundColor:
                                                            message.status === 'DELIVERED' ? '#16A34A' :
                                                                message.status === 'SENT' ? '#F59E0B' :
                                                                    message.status === 'FAILED' ? '#DC2626' :
                                                                        message.status === 'SCHEDULED' ? '#6B7280' : '#6B7280',
                                                    }}
                                                >
                                                    {message.status === 'DELIVERED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {message.status === 'SENT' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {message.status === 'FAILED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {message.status === 'SCHEDULED' && <PauseCircleOutline style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {message.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827' }}>{message.sentOn}</td>
                                            <td style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <Tooltip title="View Message" arrow>
                                                    <IconButton
                                                        onClick={() => handleView(message)}
                                                        sx={{
                                                            bgcolor: '#EFF6FF',
                                                            '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                            transition: 'background-color 0.2s, transform 0.2s',
                                                        }}
                                                    >
                                                        <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Message" arrow>
                                                    <IconButton
                                                        onClick={() => handleEdit(message)}
                                                        sx={{
                                                            bgcolor: '#FEF3C7',
                                                            '&:hover': { bgcolor: '#FDE68A', transform: 'scale(1.1)' },
                                                            transition: 'background-color 0.2s, transform 0.2s',
                                                        }}
                                                    >
                                                        <Edit style={{ fontSize: '20px', color: '#F59E0B' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Message" arrow>
                                                    <IconButton
                                                        onClick={() => handleDelete(message)}
                                                        sx={{
                                                            bgcolor: '#FEE2E2',
                                                            '&:hover': { bgcolor: '#FECACA', transform: 'scale(1.1)' },
                                                            transition: 'background-color 0.2s, transform 0.2s',
                                                        }}
                                                    >
                                                        <Delete style={{ fontSize: '20px', color: '#DC2626' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Message Log Cards (Mobile) */}
                        <div className="message-card-container">
                            {paginatedLog.map((message) => (
                                <div key={message.id} className="message-card">
                                    <div><strong>Recipients:</strong> {message.recipients}</div>
                                    <div><strong>Type:</strong> {message.type}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <strong>Status:</strong>
                                        <span
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '16px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#FFFFFF',
                                                backgroundColor:
                                                    message.status === 'DELIVERED' ? '#16A34A' :
                                                        message.status === 'SENT' ? '#F59E0B' :
                                                            message.status === 'FAILED' ? '#DC2626' :
                                                                message.status === 'SCHEDULED' ? '#6B7280' : '#6B7280',
                                            }}
                                        >
                                            {message.status === 'DELIVERED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {message.status === 'SENT' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {message.status === 'FAILED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {message.status === 'SCHEDULED' && <PauseCircleOutline style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {message.status}
                                        </span>
                                    </div>
                                    <div><strong>Sent On:</strong> {message.sentOn}</div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Tooltip title="View Message" arrow>
                                            <IconButton
                                                onClick={() => handleView(message)}
                                                sx={{
                                                    bgcolor: '#EFF6FF',
                                                    '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                    transition: 'background-color 0.2s, transform 0.2s',
                                                }}
                                            >
                                                <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Message" arrow>
                                            <IconButton
                                                onClick={() => handleEdit(message)}
                                                sx={{
                                                    bgcolor: '#FEF3C7',
                                                    '&:hover': { bgcolor: '#FDE68A', transform: 'scale(1.1)' },
                                                    transition: 'background-color 0.2s, transform 0.2s',
                                                }}
                                            >
                                                <Edit style={{ fontSize: '20px', color: '#F59E0B' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Message" arrow>
                                            <IconButton
                                                onClick={() => handleDelete(message)}
                                                sx={{
                                                    bgcolor: '#FEE2E2',
                                                    '&:hover': { bgcolor: '#FECACA', transform: 'scale(1.1)' },
                                                    transition: 'background-color 0.2s, transform 0.2s',
                                                }}
                                            >
                                                <Delete style={{ fontSize: '20px', color: '#DC2626' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>
                                Showing {paginatedLog.length} of {sortedLog.length} messages
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <IconButton
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    sx={{
                                        bgcolor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                                        '&:hover': currentPage !== 1 ? { bgcolor: '#DBEAFE', transform: 'scale(1.1)' } : {},
                                        transition: 'background-color 0.2s, transform 0.2s',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <ChevronLeft style={{ fontSize: '20px', color: currentPage === 1 ? '#6B7280' : '#2563EB' }} />
                                </IconButton>
                                <div style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '500', lineHeight: '36px' }}>
                                    Page {currentPage} of {totalPages}
                                </div>
                                <IconButton
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    sx={{
                                        bgcolor: currentPage === totalPages ? '#F3F4F6' : '#FFFFFF',
                                        '&:hover': currentPage !== totalPages ? { bgcolor: '#DBEAFE', transform: 'scale(1.1)' } : {},
                                        transition: 'background-color 0.2s, transform 0.2s',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <ChevronRight style={{ fontSize: '20px', color: currentPage === totalPages ? '#6B7280' : '#2563EB' }} />
                                </IconButton>
                            </div>
                        </div>

                        {/* Message Detail Panel */}
                        {selectedMessage && (
                            <div
                                className="preview-panel"
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: '400px',
                                    background: 'linear-gradient(145deg, #FFFFFF, #F9FAFB)',
                                    boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
                                    overflowY: 'auto',
                                    padding: '32px',
                                    zIndex: 1000,
                                    borderLeft: '1px solid #E5E7EB',
                                }}
                            >
                                <IconButton
                                    onClick={() => setSelectedMessage(null)}
                                    sx={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        bgcolor: '#FEE2E2',
                                        '&:hover': { bgcolor: '#FECACA', transform: 'scale(1.1)' },
                                        transition: 'background-color 0.2s, transform 0.2s',
                                    }}
                                >
                                    <Cancel style={{ fontSize: '20px', color: '#DC2626' }} />
                                </IconButton>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '24px', letterSpacing: '-0.025em' }}>
                                    Message Details
                                </h3>

                                {/* Basic Info */}
                                <div style={{ marginBottom: '32px' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Recipients:</strong> {selectedMessage.recipients}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Type:</strong> {selectedMessage.type}</p>
                                    <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <strong style={{ fontWeight: '500', color: '#111827' }}>Status:</strong>
                                        <span
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '16px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: '#FFFFFF',
                                                backgroundColor:
                                                    selectedMessage.status === 'DELIVERED' ? '#16A34A' :
                                                        selectedMessage.status === 'SENT' ? '#F59E0B' :
                                                            selectedMessage.status === 'FAILED' ? '#DC2626' :
                                                                selectedMessage.status === 'SCHEDULED' ? '#6B7280' : '#6B7280',
                                            }}
                                        >
                                            {selectedMessage.status === 'DELIVERED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedMessage.status === 'SENT' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedMessage.status === 'FAILED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedMessage.status === 'SCHEDULED' && <PauseCircleOutline style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedMessage.status}
                                        </span>
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Sent On:</strong> {selectedMessage.sentOn}</p>
                                    {selectedMessage.scheduled && selectedMessage.scheduledTime && (
                                        <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Scheduled Time:</strong> {selectedMessage.scheduledTime}</p>
                                    )}
                                </div>

                                {/* Rendered Preview */}
                                <MessageDetailPreview
                                    selectedMessage={selectedMessage}
                                    renderFormattedText={renderFormattedText}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewMessage;