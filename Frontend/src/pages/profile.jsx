import React, { useState, useEffect, useRef } from 'react';
import {
    Person,
    Business,
    AccountBox,
    Edit,
    PhotoCamera,
    Email,
    Phone,
    Language,
    LocationOn,
    Schedule,
    Verified,
    Warning,
    Devices,
    Save,
    Cancel,
    Delete,
    Logout,
    Computer,
    Smartphone,
    Tablet,
} from '@mui/icons-material';
import {
    IconButton,
    Tooltip,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Divider
} from '@mui/material';
import Sidebar from '../component/sidebar';
import Header from '../component/header';

const ProfilePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('profile');
    const [activeTab, setActiveTab] = useState('user');
    const [editMode, setEditMode] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [businessLogo, setBusinessLogo] = useState(null);
    const fileInputRef = useRef(null);
    const businessLogoInputRef = useRef(null);

    // State for device management dialog
    const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
    const [activeDevices, setActiveDevices] = useState([]);

    // State for notifications
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // User Profile State
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        phone: '',
        profilePicture: null
    });

    // Business Profile State
    const [businessProfile, setBusinessProfile] = useState({
        businessName: '',
        logo: null,
        about: '',
        website: '',
        address: '',
        workingHours: ''
    });

    // Account Information State
    const [accountInfo, setAccountInfo] = useState({
        accountId: '',
        wabaId: '',
        connectedNumbers: [],
        verificationStatus: 'verified',
        lastLogin: ''
    });

    // Dummy data for profile
    useEffect(() => {
        const dummyData = {
            userProfile: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                profilePicture: null
            },
            businessProfile: {
                businessName: 'Doe Enterprises',
                logo: null,
                about: 'We provide the best services in the industry with over 10 years of experience.',
                website: 'www.doeenterprises.com',
                address: '123 Business Ave, Suite 456\nNew York, NY 10001',
                workingHours: '9:00 AM - 5:00 PM, Monday to Friday'
            },
            accountInfo: {
                accountId: 'ACC-789456123',
                wabaId: 'WABA-123456789',
                connectedNumbers: ['+1 (555) 987-6543', '+1 (555) 456-7890'],
                verificationStatus: 'verified',
                lastLogin: 'Today at 2:30 PM'
            },
            activeDevices: [
                {
                    id: 1,
                    device: 'Chrome on Windows',
                    lastActive: 'Today at 2:30 PM',
                    location: 'New York, USA',
                    current: true
                },
                {
                    id: 2,
                    device: 'Safari on iPhone',
                    lastActive: 'Yesterday at 9:15 AM',
                    location: 'Chicago, USA',
                    current: false
                },
                {
                    id: 3,
                    device: 'Firefox on MacOS',
                    lastActive: '3 days ago',
                    location: 'London, UK',
                    current: false
                }
            ]
        };

        setUserProfile(dummyData.userProfile);
        setBusinessProfile(dummyData.businessProfile);
        setAccountInfo(dummyData.accountInfo);
        setActiveDevices(dummyData.activeDevices);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleFileUpload = (type) => {
        if (type === 'profile') {
            fileInputRef.current.click();
        } else {
            businessLogoInputRef.current.click();
        }
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (type === 'profile') {
                    setProfilePicture(event.target.result);
                } else {
                    setBusinessLogo(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUserProfileChange = (field, value) => {
        setUserProfile({ ...userProfile, [field]: value });
    };

    const handleBusinessProfileChange = (field, value) => {
        setBusinessProfile({ ...businessProfile, [field]: value });
    };

    const handleSave = async () => {
        // Simulate API call with timeout
        setTimeout(() => {
            setEditMode(false);
            showSnackbar('Profile updated successfully!', 'success');
        }, 500);
    };

    const handleCancel = () => {
        setEditMode(false);
        showSnackbar('Changes discarded', 'info');
    };

    const handleLogoutDevice = async (deviceId) => {
        // Simulate API call with timeout
        setTimeout(() => {
            setActiveDevices(activeDevices.filter(device => device.id !== deviceId));
            showSnackbar('Device logged out successfully', 'success');
        }, 500);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getDeviceIcon = (deviceName) => {
        if (deviceName.toLowerCase().includes('iphone') || deviceName.toLowerCase().includes('android')) {
            return <Smartphone />;
        } else if (deviceName.toLowerCase().includes('ipad') || deviceName.toLowerCase().includes('tablet')) {
            return <Tablet />;
        } else {
            return <Computer />;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#dde9f0', overflow: 'hidden' }}>
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
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(145deg, #FFFFFF, #F9FAFB)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '24px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                                    Profile Settings
                                </h1>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {editMode ? (
                                        <>
                                            <button
                                                onClick={handleCancel}
                                                style={{
                                                    padding: '10px 20px',
                                                    border: '1px solid #DC2626',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#FEE2E2',
                                                    color: '#DC2626',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <Cancel style={{ fontSize: '16px' }} />
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                style={{
                                                    padding: '10px 20px',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#059669',
                                                    color: '#FFFFFF',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <Save style={{ fontSize: '16px' }} />
                                                Save Changes
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            style={{
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: '8px',
                                                backgroundColor: '#2563EB',
                                                color: '#FFFFFF',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <Edit style={{ fontSize: '16px' }} />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            marginBottom: '24px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
                                {[
                                    { id: 'user', label: 'User Profile', icon: <Person /> },
                                    { id: 'business', label: 'Business Profile', icon: <Business /> },
                                    { id: 'account', label: 'Account Information', icon: <AccountBox /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            flex: 1,
                                            padding: '16px 24px',
                                            border: 'none',
                                            background: activeTab === tab.id ? '#EFF6FF' : 'transparent',
                                            color: activeTab === tab.id ? '#2563EB' : '#6B7280',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div style={{
                            background: 'linear-gradient(145deg, #FFFFFF, #F9FAFB)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '32px'
                        }}>
                            {/* User Profile Tab */}
                            {activeTab === 'user' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                                        User Profile Details
                                    </h2>

                                    {/* Profile Picture Section */}
                                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <div style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                backgroundColor: '#F3F4F6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                border: '4px solid #E5E7EB',
                                                margin: '0 auto'
                                            }}>
                                                {profilePicture ? (
                                                    <img
                                                        src={profilePicture}
                                                        alt="Profile"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Person style={{ fontSize: '48px', color: '#9CA3AF' }} />
                                                )}
                                            </div>
                                            {editMode && (
                                                <Tooltip title="Change Profile Picture" arrow>
                                                    <IconButton
                                                        onClick={() => handleFileUpload('profile')}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '0',
                                                            right: '0',
                                                            backgroundColor: '#2563EB',
                                                            color: '#FFFFFF',
                                                            width: '36px',
                                                            height: '36px'
                                                        }}
                                                    >
                                                        <PhotoCamera style={{ fontSize: '18px' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, 'profile')}
                                        />
                                    </div>

                                    {/* User Details Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile.name}
                                                onChange={(e) => handleUserProfileChange('name', e.target.value)}
                                                disabled={!editMode}
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    fontSize: '0.875rem',
                                                    backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                    color: editMode ? '#1F2937' : '#6B7280'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                <Email style={{ fontSize: '16px' }} />
                                                Email ID
                                            </label>
                                            <input
                                                type="email"
                                                value={userProfile.email}
                                                onChange={(e) => handleUserProfileChange('email', e.target.value)}
                                                disabled={!editMode}
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    fontSize: '0.875rem',
                                                    backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                    color: editMode ? '#1F2937' : '#6B7280'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                <Phone style={{ fontSize: '16px' }} />
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile.phone}
                                                onChange={(e) => handleUserProfileChange('phone', e.target.value)}
                                                disabled={!editMode}
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid ',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    fontSize: '0.875rem',
                                                    backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                    color: editMode ? '#1F2937' : '#6B7280'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Business Profile Tab */}
                            {activeTab === 'business' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                                        Business Profile Details
                                    </h2>

                                    {/* Business Logo Section */}
                                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <div style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '12px',
                                                backgroundColor: '#F3F4F6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                border: '4px solid #E5E7EB',
                                                margin: '0 auto'
                                            }}>
                                                {businessLogo ? (
                                                    <img
                                                        src={businessLogo}
                                                        alt="Business Logo"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Business style={{ fontSize: '48px', color: '#9CA3AF' }} />
                                                )}
                                            </div>
                                            {editMode && (
                                                <Tooltip title="Change Business Logo" arrow>
                                                    <IconButton
                                                        onClick={() => handleFileUpload('business')}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '0',
                                                            right: '0',
                                                            backgroundColor: '#2563EB',
                                                            color: '#FFFFFF',
                                                            width: '36px',
                                                            height: '36px'
                                                        }}
                                                    >
                                                        <PhotoCamera style={{ fontSize: '18px' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <input
                                            ref={businessLogoInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleImageChange(e, 'business')}
                                        />
                                    </div>

                                    {/* Business Details */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                    Business Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={businessProfile.businessName}
                                                    onChange={(e) => handleBusinessProfileChange('businessName', e.target.value)}
                                                    disabled={!editMode}
                                                    style={{
                                                        width: '100%',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '8px',
                                                        padding: '12px',
                                                        fontSize: '0.875rem',
                                                        backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                        color: editMode ? '#1F2937' : '#6B7280'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                    <Language style={{ fontSize: '16px' }} />
                                                    Website Link
                                                </label>
                                                <input
                                                    type="url"
                                                    value={businessProfile.website}
                                                    onChange={(e) => handleBusinessProfileChange('website', e.target.value)}
                                                    disabled={!editMode}
                                                    style={{
                                                        width: '100%',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '8px',
                                                        padding: '12px',
                                                        fontSize: '0.875rem',
                                                        backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                        color: editMode ? '#1F2937' : '#6B7280'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                About Business
                                            </label>
                                            <textarea
                                                value={businessProfile.about}
                                                onChange={(e) => handleBusinessProfileChange('about', e.target.value)}
                                                disabled={!editMode}
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    fontSize: '0.875rem',
                                                    minHeight: '80px',
                                                    resize: 'vertical',
                                                    backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                    color: editMode ? '#1F2937' : '#6B7280'
                                                }}
                                                placeholder="Brief description about your business..."
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                <LocationOn style={{ fontSize: '16px' }} />
                                                Business Address
                                            </label>
                                            <textarea
                                                value={businessProfile.address}
                                                onChange={(e) => handleBusinessProfileChange('address', e.target.value)}
                                                disabled={!editMode}
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    fontSize: '0.875rem',
                                                    minHeight: '60px',
                                                    resize: 'vertical',
                                                    backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                    color: editMode ? '#1F2937' : '#6B7280'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                                                <Schedule style={{ fontSize: '16px' }} />
                                                Working Hours
                                            </label>
                                            <input
                                                type="text"
                                                value={businessProfile.workingHours}
                                                onChange={(e) => handleBusinessProfileChange('workingHours', e.target.value)}
                                                disabled={!editMode}
                                                style={{
                                                    width: '100%',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    fontSize: '0.875rem',
                                                    backgroundColor: editMode ? '#FFFFFF' : '#F9FAFB',
                                                    color: editMode ? '#1F2937' : '#6B7280'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Account Information Tab */}
                            {activeTab === 'account' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '24px' }}>
                                        Account Information
                                    </h2>

                                    {/* Verification Status */}
                                    <div style={{
                                        backgroundColor: accountInfo.verificationStatus === 'verified' ? '#DCFCE7' : '#FEF3C7',
                                        border: `1px solid ${accountInfo.verificationStatus === 'verified' ? '#16A34A' : '#F59E0B'}`,
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginBottom: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        {accountInfo.verificationStatus === 'verified' ? (
                                            <Verified style={{ color: '#16A34A', fontSize: '24px' }} />
                                        ) : (
                                            <Warning style={{ color: '#F59E0B', fontSize: '24px' }} />
                                        )}
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                                                Account Status: {accountInfo.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                                                {accountInfo.verificationStatus === 'verified'
                                                    ? 'Your WhatsApp Business account is verified and ready to use.'
                                                    : 'Please complete verification to access all features.'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Details Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                                        <div style={{
                                            backgroundColor: '#F8FAFC',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            padding: '16px'
                                        }}>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                                Account ID
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'monospace', color: '#1F2937' }}>
                                                {accountInfo.accountId}
                                            </p>
                                        </div>

                                        <div style={{
                                            backgroundColor: '##F8FAFC',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            padding: '16px'
                                        }}>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                                WABA ID
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'monospace', color: '#1F2937' }}>
                                                {accountInfo.wabaId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connected Numbers */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                                            Connected Numbers
                                        </h4>
                                        {accountInfo.connectedNumbers.map((number, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    backgroundColor: '#FFFFFF',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    padding: '12px 16px',
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Phone style={{ color: '#059669', fontSize: '20px' }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1F2937' }}>
                                                        {number}
                                                    </span>
                                                </div>
                                                <Badge
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            backgroundColor: '#10B981',
                                                            color: '#FFFFFF',
                                                            fontSize: '0.75rem'
                                                        }
                                                    }}
                                                    badgeContent="Active"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions Section */}
                                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                                            Account Actions
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                            <button
                                                onClick={() => setDeviceDialogOpen(true)}
                                                style={{
                                                    padding: '12px 16px',
                                                    border: '1px solid #059669',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#ECFDF5',
                                                    color: '#059669',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#D1FAE5';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#ECFDF5';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <Devices style={{ fontSize: '16px' }} />
                                                Manage Devices
                                            </button>
                                        </div>

                                        {/* Device Management Section */}
                                        <div style={{ marginTop: '24px' }}>
                                            <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                                                Active Login Sessions
                                            </h5>
                                            <div style={{
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                padding: '16px'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '500', color: '#1F2937' }}>
                                                            Current Device - Chrome on Windows
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                                                            Last accessed: {accountInfo.lastLogin}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        sx={{
                                                            '& .MuiBadge-badge': {
                                                                backgroundColor: '#10B981',
                                                                color: '#FFFFFF',
                                                                fontSize: '0.75rem'
                                                            }
                                                        }}
                                                        badgeContent="Active"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Device Management Dialog */}
            <Dialog open={deviceDialogOpen} onClose={() => setDeviceDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Devices style={{ color: '#059669' }} />
                    Manage Devices
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        You are logged in on the following devices. Log out of any devices you don't recognize.
                    </Typography>
                    <Divider style={{ marginBottom: '16px' }} />
                    <List>
                        {activeDevices.map((device) => (
                            <ListItem key={device.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '8px' }}>
                                <ListItemIcon>
                                    {getDeviceIcon(device.device)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{device.device}</span>
                                            {device.current && (
                                                <Badge
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            backgroundColor: '#10B981',
                                                            color: '#FFFFFF',
                                                            fontSize: '0.75rem'
                                                        }
                                                    }}
                                                    badgeContent="Current"
                                                />
                                            )}
                                        </div>
                                    }
                                    secondary={
                                        <div>
                                            <div>Last active: {device.lastActive}</div>
                                            <div>Location: {device.location}</div>
                                        </div>
                                    }
                                />
                                {!device.current && (
                                    <Tooltip title="Log out from this device">
                                        <IconButton onClick={() => handleLogoutDevice(device.id)}>
                                            <Logout style={{ color: '#DC2626' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeviceDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProfilePage;