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
    ChevronLeft,
    ChevronRight,
    ArrowUpward,
    ArrowDownward,
    Sync
} from '@mui/icons-material';
import { IconButton, Tooltip, Button } from '@mui/material';
import Sidebar from '../../component/sidebar';
import Header from '../../component/header';

// Mock data for Flows (replace with API call to fetch flows)
const mockFlows = [
    {
        id: '1',
        name: 'customer_survey',
        status: 'PUBLISHED',
        language: 'en_US',
        description: 'A simple customer survey flow',
        version: '3.1',
        createdOn: '2025-08-20',
        lastModified: '2025-08-21',
        screens: [
            {
                id: 'SCREEN_1',
                title: 'Welcome Screen',
                instruction: 'Please answer the following questions.',
                components: [
                    { id: 'COMP_1', type: 'text_heading', text: 'Survey' },
                    { id: 'COMP_2', type: 'radio', label: 'How satisfied are you?', options: [{ label: 'Very', description: 'Very satisfied' }, { label: 'Not', description: 'Not satisfied' }] }
                ]
            },
            {
                id: 'SCREEN_2',
                title: 'Thank You',
                instruction: '',
                components: [
                    { id: 'COMP_3', type: 'text_body', text: 'Thanks for your feedback!' }
                ]
            }
        ],
        associatedTemplate: { name: 'survey_template', status: 'APPROVED' },
        webhookUrl: 'https://example.com/webhook',
        componentsCount: 3
    },
    {
        id: '2',
        name: 'booking_flow',
        status: 'DRAFT',
        language: 'en_US',
        description: 'Flow for booking appointments',
        version: '3.1',
        createdOn: '2025-08-18',
        lastModified: '2025-08-19',
        screens: [
            {
                id: 'SCREEN_1',
                title: 'Select Date',
                instruction: 'Choose a date',
                components: [
                    { id: 'COMP_1', type: 'date_picker', label: 'Appointment Date' }
                ]
            }
        ],
        associatedTemplate: null,
        webhookUrl: null,
        componentsCount: 1
    },
];

// FlowPreview component (unchanged)
const FlowPreview = ({ flow }) => {
    const [previewScreenIndex, setPreviewScreenIndex] = useState(0);

    if (!flow || !flow.screens || flow.screens.length === 0) {
        return (
            <div className="text-center text-gray-500 p-5 h-full flex items-center justify-center">
                No screens to preview
            </div>
        );
    }

    const screen = flow.screens[previewScreenIndex];

    const renderFormattedText = (text, comp = {}) => {
        if (!comp.markdown) {
            const style = {
                fontWeight: comp.fontWeight?.includes('bold') ? 'bold' : 'normal',
                fontStyle: comp.fontWeight?.includes('italic') ? 'italic' : 'normal',
                textDecoration: comp.strikethrough ? 'line-through' : 'none'
            };
            return <span style={style}>{text}</span>;
        }

        const parts = [];
        let currentIndex = 0;
        const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~)/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > currentIndex) {
                parts.push({ type: 'text', content: text.slice(currentIndex, match.index) });
            }
            const matchedText = match[0];
            const content = matchedText.slice(1, -1);
            const type = matchedText.startsWith('*') ? 'bold' : matchedText.startsWith('_') ? 'italic' : 'strikethrough';
            parts.push({ type, content });
            currentIndex = match.index + matchedText.length;
        }
        if (currentIndex < text.length) {
            parts.push({ type: 'text', content: text.slice(currentIndex) });
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

    const PhoneFrame = ({ children }) => (
        <div className="relative w-full max-w-[300px] aspect-[375/600] mx-auto border-[12px] border-black rounded-[48px] bg-black overflow-hidden shadow-2xl max-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-8 bg-black text-white flex items-center justify-center text-xs">
                <span className="absolute left-4">9:41</span>
                <span className="absolute right-4">Battery</span>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[20px] bg-black rounded-b-xl"></div>
            <div className="phone-frame-content relative top-8 h-[calc(100%-52px)] bg-white overflow-y-auto">
                {children}
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90px] h-1 bg-white rounded-full"></div>
        </div>
    );

    return (
        <PhoneFrame>
            <div className="p-4">
                <div className="mb-4">
                    {screen.title && (
                        <div className="text-gray-800 text-sm font-semibold p-2 rounded-t-lg">
                            {screen.title}
                        </div>
                    )}
                    {screen.instruction && (
                        <div className="text-gray-700 text-sm p-2 rounded-b-lg mb-2">
                            {screen.instruction}
                        </div>
                    )}
                    {screen.components.map((comp, index) => {
                        switch (comp.type) {
                            case 'text_heading':
                                return (
                                    <div key={index} className="text-green-800 text-base font-bold p-2 rounded-lg mb-2">
                                        {comp.text || 'Enter heading'}
                                    </div>
                                );
                            case 'text_subheading':
                                return (
                                    <div key={index} className="text-green-800 text-sm font-semibold p-2 rounded-lg mb-2">
                                        {comp.text || 'Enter subheading'}
                                    </div>
                                );
                            case 'text_body':
                                return (
                                    <div key={index} className="text-gray-700 text-sm p-2 rounded-lg mb-2">
                                        {renderFormattedText(comp.text || 'Enter body text', comp)}
                                    </div>
                                );
                            case 'text_caption':
                                return (
                                    <div key={index} className="text-gray-500 text-xs p-2 rounded-lg mb-2">
                                        {renderFormattedText(comp.text || 'Enter caption', comp)}
                                    </div>
                                );
                            case 'image':
                                if (!comp.previewUrl && !comp.url) {
                                    return (
                                        <div key={index} className="w-full h-32 flex items-center justify-center mb-2 rounded text-gray-500">
                                            Add Image
                                        </div>
                                    );
                                }
                                return (
                                    <img
                                        key={index}
                                        src={comp.previewUrl || comp.url}
                                        alt={comp.altText || 'Image'}
                                        className="w-full mb-2 rounded-lg"
                                    />
                                );
                            case 'embedded_link':
                                return (
                                    <a
                                        key={index}
                                        href={comp.url || '#'}
                                        className="text-blue-600 underline p-2 rounded-lg mb-2 block"
                                    >
                                        {comp.text || 'Enter link text'}
                                    </a>
                                );
                            case 'text_input':
                                return (
                                    <div key={index} className="p-2 rounded-lg mb-2 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{comp.label || 'Label'}</label>
                                        <input
                                            type="text"
                                            placeholder={comp.placeholder || comp.label || 'Enter text'}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            disabled
                                        />
                                    </div>
                                );
                            case 'textarea':
                                return (
                                    <div key={index} className="p-2 rounded-lg mb-2 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{comp.label || 'Label'}</label>
                                        <textarea
                                            placeholder={comp.placeholder || comp.label || 'Enter text'}
                                            className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] text-sm"
                                            disabled
                                        />
                                    </div>
                                );
                            case 'opt_in':
                                return (
                                    <label key={index} className="block p-2 rounded-lg mb-2 shadow-sm">
                                        <input type="checkbox" className="mr-2" disabled /> {comp.label || 'Opt-in'}
                                    </label>
                                );
                            case 'radio':
                                return (
                                    <div key={index} className="p-2 rounded-lg mb-2 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{comp.label || 'Radio Group'}</label>
                                        {comp.options?.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No options</p>
                                        ) : (
                                            comp.options.map((opt, i) => (
                                                <label key={i} className="block mb-1">
                                                    <input type="radio" name={`radio_${index}`} className="mr-2" disabled /> {opt.label || `Option ${i + 1}`} <small className="text-gray-500">{opt.description}</small>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                );
                            case 'checkbox':
                                return (
                                    <div key={index} className="p-2 rounded-lg mb-2 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{comp.label || 'Checkbox Group'}</label>
                                        {comp.options?.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No options</p>
                                        ) : (
                                            comp.options.map((opt, i) => (
                                                <label key={i} className="block mb-1">
                                                    <input type="checkbox" className="mr-2" disabled /> {opt.label || `Option ${i + 1}`} <small className="text-gray-500">{opt.description}</small>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                );
                            case 'dropdown':
                                return (
                                    <div key={index} className="p-2 rounded-lg mb-2 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{comp.label || 'Dropdown'}</label>
                                        <select className="w-full p-2 border border-gray-300 rounded-md text-sm" disabled>
                                            {comp.options?.length === 0 ? (
                                                <option>No options</option>
                                            ) : (
                                                comp.options.map((opt, i) => (
                                                    <option key={i} value={opt.postbackData}>{opt.label || `Option ${i + 1}`} - {opt.description}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                );
                            case 'date_picker':
                                return (
                                    <div key={index} className="p-2 rounded-lg mb-2 shadow-sm">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{comp.label || 'Date Picker'}</label>
                                        <input
                                            type="date"
                                            value={comp.defaultDate || ''}
                                            min={comp.minDate || ''}
                                            max={comp.maxDate || ''}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            disabled
                                        />
                                    </div>
                                );
                            case 'yes_no':
                                return (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <button className="px-4 py-2 text-green-800 rounded-lg" disabled>{comp.yesText || 'Yes'}</button>
                                        <button className="px-4 py-2 text-red-800 rounded-lg" disabled>{comp.noText || 'No'}</button>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
                <div className="flex justify-between mt-4">
                    {previewScreenIndex > 0 && (
                        <button
                            onClick={() => setPreviewScreenIndex(previewScreenIndex - 1)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                        >
                            Back
                        </button>
                    )}
                    {previewScreenIndex < flow.screens.length - 1 && (
                        <button
                            onClick={() => setPreviewScreenIndex(previewScreenIndex + 1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </PhoneFrame>
    );
};

const ViewFlows = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('view flows');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOption, setSortOption] = useState('NEWEST');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const flowsPerPage = 10;
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
        console.log('Syncing flows with Meta...');
        // Replace with actual API call to sync with Meta
    };

    const filteredFlows = mockFlows
        .filter((flow) =>
            flow.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((flow) =>
            statusFilter === 'ALL' ? true : flow.status === statusFilter
        )
        .sort((a, b) => {
            const direction = sortDirection === 'asc' ? 1 : -1;
            if (sortOption === 'NEWEST' || sortOption === 'OLDEST') {
                return direction * (new Date(b.lastModified) - new Date(a.lastModified));
            } else {
                return direction * a.name.localeCompare(b.name);
            }
        });

    const totalPages = Math.ceil(filteredFlows.length / flowsPerPage);
    const paginatedFlows = filteredFlows.slice(
        (currentPage - 1) * flowsPerPage,
        currentPage * flowsPerPage
    );

    const handlePreview = (flow) => {
        setSelectedFlow(flow);
    };

    const handleEdit = (flow) => {
        navigate('/create_flow', { state: { flow } });
    };

    const handleDelete = (flow) => {
        console.log(`Delete flow: ${flow.name}`);
        // Replace with API call to delete flow
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
            <style>
                {`
                    @media (max-width: 768px) {
                        .flow-table {
                            display: none;
                        }
                        .flow-card-container {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        }
                        .flow-card {
                            background: linear-gradient(145deg, #FFFFFF, #F9FAFB);
                            border: 1px solid #E5E7EB;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                            transition: transform 0.2s, box-shadow 0.2s;
                        }
                        .flow-card:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
                        }
                        .flow-card div {
                            margin-bottom: 12px;
                            font-size: 0.875rem;
                        }
                        .flow-card div:last-child {
                            margin-bottom: 0;
                        }
                    }
                    @media (min-width: 769px) {
                        .flow-card-container {
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
                    .flow-table th {
                        position: relative;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .flow-table th:hover {
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
                            View Flows
                        </h2>

                        {/* Search, Filter, and Sort */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '240px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by flow name"
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
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                        outline: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '400',
                                        backgroundColor: '#FFFFFF',
                                        minWidth: '160px',
                                    }}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                                <Tooltip title="sync with meta">
                                    <Button
                                        onClick={handleSyncWithMeta}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '10px',
                                            backgroundColor: '#2563EB',
                                            color: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <Sync style={{ fontSize: '20px' }} />
                                        sync with meta
                                    </Button>
                                </Tooltip>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Tooltip title="sort by newest/oldest">
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
                                        date {sortOption === 'NEWEST' && (sortDirection === 'desc' ? <ArrowDownward style={{ fontSize: '16px' }} /> : <ArrowUpward style={{ fontSize: '16px' }} />)}
                                    </Button>
                                </Tooltip>
                                <Tooltip title="sort alphabetically">
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
                                        name {sortOption === 'ALPHABETICAL' && (sortDirection === 'asc' ? <ArrowUpward style={{ fontSize: '16px' }} /> : <ArrowDownward style={{ fontSize: '16px' }} />)}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Flow List Table (Desktop) */}
                        <div className="table-container" style={{ marginBottom: '32px' }}>
                            <table className="flow-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
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
                                                width: '20%',
                                                backgroundColor: sortOption === 'ALPHABETICAL' ? '#DBEAFE' : 'transparent',
                                                position: 'relative',
                                            }}
                                        >
                                            Flow Name
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
                                            width: '15%',
                                        }}>
                                            Status
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
                                            Flow ID
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
                                            Last Modified
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
                                            Screens Count
                                        </th>
                                        <th style={{
                                            padding: '16px',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            borderBottom: '2px solid #D1D5DB',
                                            width: '10%',
                                        }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedFlows.map((flow, index) => (
                                        <tr
                                            key={flow.id}
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
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>{flow.name}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '16px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#FFFFFF',
                                                        backgroundColor:
                                                            flow.status === 'PUBLISHED' ? '#16A34A' :
                                                                flow.status === 'DRAFT' ? '#F59E0B' :
                                                                    flow.status === 'ARCHIVED' ? '#DC2626' :
                                                                        '#6B7280',
                                                    }}
                                                >
                                                    {flow.status === 'PUBLISHED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {flow.status === 'DRAFT' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {flow.status === 'ARCHIVED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                                    {flow.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827' }}>{flow.id}</td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827' }}>{flow.lastModified}</td>
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#111827' }}>{flow.screens.length}</td>
                                            <td style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <Tooltip title="View Flow" arrow>
                                                    <IconButton
                                                        onClick={() => handlePreview(flow)}
                                                        sx={{
                                                            bgcolor: '#EFF6FF',
                                                            '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                            transition: 'background-color 0.2s, transform 0.2s',
                                                        }}
                                                    >
                                                        <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Flow" arrow>
                                                    <IconButton
                                                        onClick={() => handleEdit(flow)}
                                                        sx={{
                                                            bgcolor: '#FEF3C7',
                                                            '&:hover': { bgcolor: '#FDE68A', transform: 'scale(1.1)' },
                                                            transition: 'background-color 0.2s, transform 0.2s',
                                                        }}
                                                    >
                                                        <Edit style={{ fontSize: '20px', color: '#F59E0B' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Flow" arrow>
                                                    <IconButton
                                                        onClick={() => handleDelete(flow)}
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

                        {/* Flow Cards (Mobile) */}
                        <div className="flow-card-container">
                            {paginatedFlows.map((flow) => (
                                <div key={flow.id} className="flow-card">
                                    <div><strong>Name:</strong> {flow.name}</div>
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
                                                    flow.status === 'PUBLISHED' ? '#16A34A' :
                                                        flow.status === 'DRAFT' ? '#F59E0B' :
                                                            flow.status === 'ARCHIVED' ? '#DC2626' :
                                                                '#6B7280',
                                            }}
                                        >
                                            {flow.status === 'PUBLISHED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {flow.status === 'DRAFT' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {flow.status === 'ARCHIVED' && <Cancel style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {flow.status}
                                        </span>
                                    </div>
                                    <div><strong>ID:</strong> {flow.id}</div>
                                    <div><strong>Last Modified:</strong> {flow.lastModified}</div>
                                    <div><strong>Screens:</strong> {flow.screens.length}</div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Tooltip title="View Flow" arrow>
                                            <IconButton
                                                onClick={() => handlePreview(flow)}
                                                sx={{
                                                    bgcolor: '#EFF6FF',
                                                    '&:hover': { bgcolor: '#DBEAFE', transform: 'scale(1.1)' },
                                                    transition: 'background-color 0.2s, transform 0.2s',
                                                }}
                                            >
                                                <Visibility style={{ fontSize: '20px', color: '#2563EB' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Flow" arrow>
                                            <IconButton
                                                onClick={() => handleEdit(flow)}
                                                sx={{
                                                    bgcolor: '#FEF3C7',
                                                    '&:hover': { bgcolor: '#FDE68A', transform: 'scale(1.1)' },
                                                    transition: 'background-color 0.2s, transform 0.2s',
                                                }}
                                            >
                                                <Edit style={{ fontSize: '20px', color: '#F59E0B' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Flow" arrow>
                                            <IconButton
                                                onClick={() => handleDelete(flow)}
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
                                Showing {paginatedFlows.length} of {filteredFlows.length} flows
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

                        {/* Flow Detail Panel */}
                        {selectedFlow && (
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
                                    onClick={() => setSelectedFlow(null)}
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
                                    Flow Details: {selectedFlow.name}
                                </h3>

                                {/* Metadata */}
                                <div style={{ marginBottom: '32px' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Description:</strong> {selectedFlow.description}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Version:</strong> {selectedFlow.version}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Language:</strong> {selectedFlow.language}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Created On:</strong> {selectedFlow.createdOn}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Last Modified:</strong> {selectedFlow.lastModified}</p>
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
                                                    selectedFlow.status === 'PUBLISHED' ? '#16A34A' :
                                                        selectedFlow.status === 'DRAFT' ? '#F59E0B' :
                                                            selectedFlow.status === 'ARCHIVED' ? '#DC2626' :
                                                                '#6B7280',
                                            }}
                                        >
                                            {selectedFlow.status === 'PUBLISHED' && <CheckCircle style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedFlow.status === 'DRAFT' && <HourglassEmpty style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedFlow.status === 'ARCHIVED' && <Cancel style={ { fontSize: '14px', verticalAlign: 'middle', marginRight: '6px' }} />}
                                            {selectedFlow.status}
                                        </span>
                                    </p>
                                    {selectedFlow.associatedTemplate && (
                                        <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}>
                                            <strong>Associated Template:</strong> {selectedFlow.associatedTemplate.name} ({selectedFlow.associatedTemplate.status})
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Screens Count:</strong> {selectedFlow.screens.length}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '12px', fontWeight: '500' }}><strong>Components Count:</strong> {selectedFlow.componentsCount}</p>
                                </div>

                                {/* Flow Components Overview */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                                        Components Overview
                                    </h4>
                                    {selectedFlow.screens.map((screen, screenIndex) => (
                                        <div key={screenIndex} style={{ marginBottom: '16px' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}><strong>Screen {screenIndex + 1}:</strong> {screen.title}</p>
                                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                                {screen.components.map((comp, compIndex) => (
                                                    <li key={compIndex} style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '400' }}>
                                                        {comp.type.replace('_', ' ').toUpperCase()}: {comp.label || comp.text || 'No details'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Flow Preview */}
                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: ' #1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
                                        Flow Preview
                                    </h4>
                                    <FlowPreview flow={selectedFlow} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewFlows;