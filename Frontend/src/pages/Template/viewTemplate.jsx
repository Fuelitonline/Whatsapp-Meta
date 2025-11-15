import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Visibility,
    Edit,
    Delete,
    CheckCircle,
    HourglassEmpty,
    Cancel,
    PauseCircleOutline,
    ChevronLeft,
    ChevronRight,
    Link,
    Phone,
    ArrowUpward,
    ArrowDownward,
    Sync
} from '@mui/icons-material';
import { IconButton, Tooltip, Button } from '@mui/material';
import Sidebar from '../../component/sidebar';
import Header from '../../component/header';
import TemplatePreview from '../../component/Template/TemplatePreview';

// Mock data (replace with API call to /message_templates)
const mockTemplates = [
    {
        id: '1',
        name: 'order_confirmation',
        category: 'UTILITY',
        language: 'en_US',
        status: 'APPROVED',
        createdOn: '2025-08-20',
        components: {
            header: { format: 'TEXT', text: 'Order Confirmation' },
            body: { text: 'Hi *{{1}}*, your order _{{2}}_ is ~confirmed~.' },
            footer: { text: 'Thank you for shopping!' },
            buttons: [{ type: 'URL', text: 'View Order', url: 'https://example.com/order/{{2}}' }],
        },
        sampleValues: { '{{1}}': 'John', '{{2}}': '12345' },
        rejectionReason: '',
    },
    {
        id: '2',
        name: 'discount_offer',
        category: 'MARKETING',
        language: 'en_GB',
        status: 'PENDING',
        createdOn: '2025-08-18',
        components: {
            body: { text: 'Get *20% off* your next purchase, {{1}}! Click below.' },
            buttons: [{ type: 'URL', text: 'Claim Offer', url: 'https://example.com/discount' }],
        },
        sampleValues: { '{{1}}': 'Alice' },
        rejectionReason: '',
    },
    {
        id: '3',
        name: 'otp_login',
        category: 'AUTHENTICATION',
        language: 'en_US',
        status: 'REJECTED',
        createdOn: '2025-08-17',
        components: {
            body: { text: 'Your OTP is {{1}}. Valid for 5 minutes.' },
            buttons: [{ type: 'REPLY', text: 'Verify' }],
        },
        sampleValues: { '{{1}}': '392481' },
        rejectionReason: 'Template contains invalid OTP format.',
    },
    {
        id: '4',
        name: 'delivery_update',
        category: 'UTILITY',
        language: 'hi_IN',
        status: 'PAUSED',
        createdOn: '2025-08-15',
        components: {
            header: { format: 'IMAGE', file: 'delivery.jpg' },
            body: { text: 'Your package will arrive in {{1}} days.' },
        },
        sampleValues: { '{{1}}': '2' },
        rejectionReason: '',
    },
];

const ViewTemplates = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('view templates');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [sortOption, setSortOption] = useState('NEWEST');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const templatesPerPage = 10;
    const navigate = useNavigate();

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

    const handleSyncWithMeta = () => {
        console.log('Syncing templates with Meta');
        // Replace with API call to sync templates with Meta
    };

    const filteredTemplates = mockTemplates
        .filter((template) =>
            template.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((template) =>
            statusFilter === 'ALL' ? true : template.status === statusFilter
        )
        .filter((template) =>
            categoryFilter === 'ALL' ? true : template.category === categoryFilter
        )
        .sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            if (sortOption === 'NEWEST' || sortOption === 'OLDEST') {
                return direction * (new Date(b.createdOn) - new Date(a.createdOn));
            } else {
                return direction * a.name.localeCompare(b.name);
            }
        });

    const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
    const paginatedTemplates = filteredTemplates.slice(
        (currentPage - 1) * templatesPerPage,
        currentPage * templatesPerPage
    );

    const renderFormattedText = (text, sampleValues = {}) => {
        let formattedText = text.replace(/{{[0-9]+}}/g, (match) => sampleValues[match] || match);
        const parts = [];
        let currentIndex = 0;
        const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~)/g;
        let match;

        while ((match = regex.exec(formattedText)) !== null) {
            if (match.index > currentIndex) {
                parts.push({ type: 'text', content: formattedText.slice(currentIndex, match.index) });
            }
            const matchedText = match[0];
            const content = matchedText.slice(1, -1);
            const type = matchedText.startsWith('*') ? 'bold' : matchedText.startsWith('_') ? 'italic' : 'strikethrough';
            parts.push({ type, content });
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
            } else {
                return <span key={index}>{part.content}</span>;
            }
        });
    };

    const handlePreview = (template) => {
        setSelectedTemplate(template);
    };

    const handleEdit = (template) => {
        navigate('/create_template', { state: { template } });
    };

    const handleResubmit = (template) => {
        console.log(`Resubmit template: ${template.name}`);
        // Replace with API call to resubmit template
    };

    const handleDelete = (template) => {
        console.log(`Delete template: ${template.name}`);
        // Replace with API call to delete template
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
            <style>
                {`
          @media (max-width: 768px) {
            .template-table {
              display: none;
            }
            .template-card-container {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .template-card {
              background: linear-gradient(145deg, #FFFFFF, #F9FAFB);
              border: 1px solid #E5E7EB;
              border-radius: 12px;
              padding: 20px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .template-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(0,0,0,0.12);
            }
            .template-card div {
              margin-bottom: 12px;
              font-size: 0.875rem;
            }
            .template-card div:last-child {
              margin-bottom: 0;
            }
          }
          @media (min-width: 769px) {
            .template-card-container {
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
          .template-table th {
            position: relative;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .template-table th:hover {
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
                            View WhatsApp Message Templates
                        </h2>

                        {/* Search, Filter, Sort */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '240px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by template name"
                                        style={{
                                            width: '100%',
                                            padding: '12px 12px 12px 40px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '10px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                            outline: 'none',
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                            fontSize: '0.875rem',
                                            fontWeight: '400',
                                            backgroundColor: '#FFFFFF',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#2563EB';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#D1D5DB';
                                            e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{
                                        padding: '12px 16px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        fontSize: '0.875rem',
                                        fontWeight: '400',
                                        minWidth: '160px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#2563EB';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D1D5DB';
                                        e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="PAUSED">Paused</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    style={{
                                        padding: '12px 16px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        fontSize: '0.875rem',
                                        fontWeight: '400',
                                        minWidth: '160px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#2563EB';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D1D5DB';
                                        e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <option value="ALL">All Categories</option>
                                    <option value="UTILITY">Utility</option>
                                    <option value="MARKETING">Marketing</option>
                                    <option value="AUTHENTICATION">Authentication</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <select
                                    value={sortOption}
                                    onChange={(e) => handleSort(e.target.value)}
                                    style={{
                                        padding: '12px 16px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        fontSize: '0.875rem',
                                        fontWeight: '400',
                                        minWidth: '160px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#2563EB';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#D1D5DB';
                                        e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <option value="NEWEST">Newest</option>
                                    <option value="OLDEST">Oldest</option>
                                    <option value="ALPHABETICAL">Alphabetical</option>
                                </select>
                                <Button
                                    variant="contained"
                                    startIcon={<Sync />}
                                    onClick={handleSyncWithMeta}
                                    sx={{
                                        padding: '10px 16px',
                                        borderRadius: '10px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        textTransform: 'none',
                                        backgroundColor: '#2563EB',
                                        color: '#FFFFFF',
                                        '&:hover': {
                                            backgroundColor: '#1D4ED8',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'background-color 0.2s, transform 0.2s',
                                    }}
                                >
                                    Sync with Meta
                                </Button>
                            </div>
                        </div>

                        {/* Template Table */}
                        <div className="table-container">
                            <table className="template-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(90deg, #F3F4F6, #E5E7EB)' }}>
                                        <th
                                            onClick={() => handleSort('ALPHABETICAL')}
                                            style={{
                                                padding: '16px 20px',
                                                textAlign: 'left',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#1F2937',
                                                borderBottom: '2px solid #D1D5DB',
                                                width: '20%',
                                                backgroundColor: sortOption === 'ALPHABETICAL' ? '#DBEAFE' : 'transparent',
                                                position: 'relative',
                                            }}
                                        >
                                            Template Name
                                            {sortOption === 'ALPHABETICAL' && (
                                                <span className="sort-icon">
                                                    {sortDirection === 'asc' ? <ArrowUpward style={{ fontSize: '16px', color: '#2563EB' }} /> : <ArrowDownward style={{ fontSize: '16px', color: '#2563EB' }} />}
                                                </span>
                                            )}
                                        </th>
                                        <th style={{
                                            padding: '16px 20px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '15%'
                                        }}>
                                            Category
                                        </th>
                                        <th style={{
                                            padding: '16px 20px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '15%'
                                        }}>
                                            Language
                                        </th>
                                        <th style={{
                                            padding: '16px 20px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '20%'
                                        }}>
                                            Status
                                        </th>
                                        <th
                                            onClick={() => handleSort('NEWEST')}
                                            style={{
                                                padding: '16px 20px',
                                                textAlign: 'left',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#1F2937',
                                                borderBottom: '2px solid #D1D5DB',
                                                width: '15%',
                                                backgroundColor: sortOption === 'NEWEST' || sortOption === 'OLDEST' ? '#DBEAFE' : 'transparent',
                                                position: 'relative',
                                            }}
                                        >
                                            Created On
                                            {(sortOption === 'NEWEST' || sortOption === 'OLDEST') && (
                                                <span className="sort-icon">
                                                    {sortDirection === 'asc' ? <ArrowUpward style={{ fontSize: '16px', color: '#2563EB' }} /> : <ArrowDownward style={{ fontSize: '16px', color: '#2563EB' }} />}
                                                </span>
                                            )}
                                        </th>
                                        <th style={{
                                            padding: '16px 20px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '15%'
                                        }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTemplates.map((template, index) => (
                                        <tr
                                            key={template.id}
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
                                            <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{template.name}</td>
                                            <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#111827' }}>{template.category}</td>
                                            <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#111827' }}>{template.language}</td>
                                            <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '16px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#FFFFFF',
                                                        backgroundColor:
                                                            template.status === 'APPROVED' ? '#16A34A' :
                                                                template.status === 'PENDING' ? '#F59E0B' :
                                                                    template.status === 'REJECTED' ? '#DC2626' :
                                                                        '#6B7280',
                                                    }}
                                                >
                                                    {template.status === 'APPROVED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {template.status === 'PENDING' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {template.status === 'REJECTED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {template.status === 'PAUSED' && <PauseCircleOutline style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {template.status}
                                                </span>
                                                {template.status === 'REJECTED' && template.rejectionReason && (
                                                    <Tooltip title={template.rejectionReason} arrow>
                                                        <span style={{ color: '#DC2626', fontSize: '0.75rem', cursor: 'pointer' }}>(Reason)</span>
                                                    </Tooltip>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#111827' }}>{template.createdOn}</td>
                                            <td style={{ padding: '16px 20px', fontSize: '0.875rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <Tooltip title="View Template" arrow>
                                                    <IconButton
                                                        onClick={() => handlePreview(template)}
                                                        sx={{
                                                            bgcolor: '#EFF6FF',
                                                            '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                            transition: 'background-color 0.2s, transform 0.2s',
                                                        }}
                                                    >
                                                        <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                {(template.status === 'PENDING' || template.status === 'DRAFT') && (
                                                    <Tooltip title="Edit Template" arrow>
                                                        <IconButton
                                                            onClick={() => handleEdit(template)}
                                                            sx={{
                                                                bgcolor: '#EFF6FF',
                                                                '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                                transition: 'background-color 0.2s, transform 0.2s',
                                                            }}
                                                        >
                                                            <Edit style={{ fontSize: '20px', color: '#2563EB' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {template.status === 'REJECTED' && (
                                                    <Tooltip title="Fix & Resubmit" arrow>
                                                        <IconButton
                                                            onClick={() => handleResubmit(template)}
                                                            sx={{
                                                                bgcolor: '#DCFCE7',
                                                                '&:hover': { bgcolor: '#BBF7D0', transform: 'scale(1.1)' },
                                                                transition: 'background-color 0.2s, transform 0.2s',
                                                            }}
                                                        >
                                                            <CheckCircle style={{ fontSize: '20px', color: '#16A34A' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Delete Template" arrow>
                                                    <IconButton
                                                        onClick={() => handleDelete(template)}
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

                        {/* Mobile Card Layout */}
                        <div className="template-card-container">
                            {paginatedTemplates.map((template) => (
                                <div key={template.id} className="template-card">
                                    <div><strong>Name:</strong> {template.name}</div>
                                    <div><strong>Category:</strong> {template.category}</div>
                                    <div><strong>Language:</strong> {template.language}</div>
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
                                                    template.status === 'APPROVED' ? '#16A34A' :
                                                        template.status === 'PENDING' ? '#F59E0B' :
                                                            template.status === 'REJECTED' ? '#DC2626' :
                                                                '#6B7280',
                                            }}
                                        >
                                            {template.status === 'APPROVED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {template.status === 'PENDING' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {template.status === 'REJECTED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {template.status === 'PAUSED' && <PauseCircleOutline style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {template.status}
                                        </span>
                                        {template.status === 'REJECTED' && template.rejectionReason && (
                                            <Tooltip title={template.rejectionReason} arrow>
                                                <span style={{ color: '#DC2626', fontSize: '0.75rem', cursor: 'pointer' }}>(Reason)</span>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <div><strong>Created On:</strong> {template.createdOn}</div>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Tooltip title="View Template" arrow>
                                            <IconButton
                                                onClick={() => handlePreview(template)}
                                                sx={{
                                                    bgcolor: '#EFF6FF',
                                                    '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                    transition: 'background-color 0.2s, transform 0.2s',
                                                }}
                                            >
                                                <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {(template.status === 'PENDING' || template.status === 'DRAFT') && (
                                            <Tooltip title="Edit Template" arrow>
                                                <IconButton
                                                    onClick={() => handleEdit(template)}
                                                    sx={{
                                                        bgcolor: '#EFF6FF',
                                                        '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                        transition: 'background-color 0.2s, transform 0.2s',
                                                    }}
                                                >
                                                    <Edit style={{ fontSize: '20px', color: '#2563EB' }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {template.status === 'REJECTED' && (
                                            <Tooltip title="Fix & Resubmit" arrow>
                                                <IconButton
                                                    onClick={() => handleResubmit(template)}
                                                    sx={{
                                                        bgcolor: '#DCFCE7',
                                                        '&:hover': { bgcolor: '#BBF7D0', transform: 'scale(1.1)' },
                                                        transition: 'background-color 0.2s, transform 0.2s',
                                                    }}
                                                >
                                                    <CheckCircle style={{ fontSize: '20px', color: '#16A34A' }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Delete Template" arrow>
                                            <IconButton
                                                onClick={() => handleDelete(template)}
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
                                Showing {paginatedTemplates.length} of {filteredTemplates.length} templates
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

                        {/* Preview Panel */}
                        {selectedTemplate && (
                            <div
                                className="preview-panel"
                                style={{
                                    position: 'fixed',
                                    top: '0',
                                    right: '0',
                                    width: '400px',
                                    height: '100vh',
                                    background: 'linear-gradient(145deg, #FFFFFF, #F9FAFB)',
                                    boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
                                    padding: '32px',
                                    overflowY: 'auto',
                                    zIndex: 1000,
                                    borderLeft: '1px solid #E5E7EB',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', letterSpacing: '-0.025em' }}>Template Preview</h3>
                                    <IconButton
                                        onClick={() => setSelectedTemplate(null)}
                                        sx={{
                                            bgcolor: '#FEE2E2',
                                            '&:hover': { bgcolor: '#FECACA', transform: 'scale(1.1)' },
                                            transition: 'background-color 0.2s, transform 0.2s',
                                        }}
                                    >
                                        <Cancel style={{ fontSize: '20px', color: '#DC2626' }} />
                                    </IconButton>
                                </div>

                                {/* Basic Info */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                                        Basic Information
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Name:</strong> {selectedTemplate.name}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Category:</strong> {selectedTemplate.category}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Language:</strong> {selectedTemplate.language}</p>
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
                                                    selectedTemplate.status === 'APPROVED' ? '#16A34A' :
                                                        selectedTemplate.status === 'PENDING' ? '#F59E0B' :
                                                            selectedTemplate.status === 'REJECTED' ? '#DC2626' :
                                                                '#6B7280',
                                            }}
                                        >
                                            {selectedTemplate.status === 'APPROVED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedTemplate.status === 'PENDING' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedTemplate.status === 'REJECTED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedTemplate.status === 'PAUSED' && <PauseCircleOutline style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedTemplate.status}
                                        </span>
                                    </p>
                                    {selectedTemplate.status === 'REJECTED' && selectedTemplate.rejectionReason && (
                                        <p style={{ color: '#DC2626', fontSize: '0.75rem', marginBottom: '12px', fontWeight: '500' }}>
                                            <strong>Rejection Reason:</strong> {selectedTemplate.rejectionReason}
                                        </p>
                                    )}
                                </div>

                                {/* Components */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                                        Components
                                    </h4>
                                    {selectedTemplate.components.header && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}><strong>Header:</strong> {selectedTemplate.components.header.format}</p>
                                            {selectedTemplate.components.header.format === 'TEXT' ? (
                                                <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '400' }}>{selectedTemplate.components.header.text}</p>
                                            ) : (
                                                <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '400' }}>File: {selectedTemplate.components.header.file}</p>
                                            )}
                                        </div>
                                    )}
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}><strong>Body:</strong></p>
                                        <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '400' }}>{renderFormattedText(selectedTemplate.components.body.text, selectedTemplate.sampleValues)}</p>
                                    </div>
                                    {selectedTemplate.components.footer && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}><strong>Footer:</strong> {selectedTemplate.components.footer.text}</p>
                                        </div>
                                    )}
                                    {selectedTemplate.components.buttons && (
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}><strong>Buttons:</strong></p>
                                            {selectedTemplate.components.buttons.map((button, index) => (
                                                <p key={index} style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '400' }}>
                                                    {button.type}: {button.text} {button.url ? `(${button.url})` : ''}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rendered Preview */}
                                <TemplatePreview selectedTemplate={selectedTemplate} renderFormattedText={renderFormattedText} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewTemplates;