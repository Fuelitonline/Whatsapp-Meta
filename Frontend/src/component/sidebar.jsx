import React from 'react';
import {
    Dashboard as DashboardIcon,
    AddCircle,
    Landscape,
    Chat,
    Image,
    SmartButton,
    List,
    Webhook,
    Payments,
    Business,
    Api,
    ManageAccounts,
    Help,
    MenuOpen,
    Logout,
    ReceiptLong,
    BarChart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleNavItemClick }) => {
    const navigate = useNavigate();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
        {
            id: 'templates', label: 'Templates', icon: AddCircle, subItems: [
                { id: 'create-template', label: 'Create Template', icon: AddCircle, path: '/create_template' },
                { id: 'view-templates', label: 'View Templates', icon: Landscape, path: '/view_templates' }
            ]
        },
        {
            id: 'flow', label: 'Flow', icon: SmartButton, subItems: [
                { id: 'create-flow', label: 'Create Flow', icon: SmartButton, path: '/create_flow' },
                { id: 'view-flows', label: 'View Flows', icon: List, path: '/view_flows' }
            ]
        },
        {
            id: 'messages', label: 'Messages', icon: Chat, subItems: [
                { id: 'send-messages', label: 'Messages', icon: Chat, path: '/message' },
                { id: 'view-messages', label: 'View Messages', icon: Chat, path: '/view_messages' } // Added item
            ]
        },
        {
            id: 'webhooks', label: 'Webhooks', icon: Webhook, subItems: [
                { id: 'setup-webhook', label: 'Setup Webhook URL', icon: Webhook, path: '/webhook' }
            ]
        },
        {
            id: 'billing-usage', label: 'Billing & Usage Stats', icon: Payments, subItems: [
                { id: 'usage-analytics', label: 'Usage Analytics', icon: BarChart, path: '/usage_analytics' },
                { id: 'billing', label: 'Billing', icon: Payments, path: '/billing' }
            ]
        },
        {
            id: 'settings', label: 'Settings', icon: Business, subItems: [
                { id: 'profile-settings', label: 'Profile Settings', icon: Business, path: '/profile' },
                { id: 'account-settings', label: 'Account Settings', icon: ManageAccounts, path: '/account-settings' }
            ]
        },
        {
            id: 'support', label: 'Support', icon: Help, subItems: [
                { id: 'help-center', label: 'Help Center', icon: Help, path: '/help-center' }
            ]
        }
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavigation = (itemId, path) => {
        handleNavItemClick(itemId);
        if (path) {
            navigate(path);
        }
    };

    return (
        <>
            <style>
                {`
                    .scrollbar-hidden::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hidden {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .group:hover .icon {
                        color: #255267 !important;
                    }
                `}
            </style>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <div className={`fixed md:relative z-30 md:z-auto transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out md:flex flex-col w-64 bg-[#255267] border-r border-gray-200 h-full`}>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Chat sx={{ color: '#ffffff' }} />
                        <h1 className="font-bold text-lg text-white">FIO's WABM</h1>
                    </div>
                    <button
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={toggleSidebar}
                    >
                        <MenuOpen sx={{ color: '#ffffff' }} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 scrollbar-hidden">
                    <nav className="px-2 space-y-1">
                        {navItems.map((item) => (
                            <div key={item.id}>
                                {item.subItems ? (
                                    <div className="pt-2">
                                        <p className="px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                                            {item.label}
                                        </p>
                                        {item.subItems.map((subItem) => (
                                            <button
                                                key={subItem.id}
                                                onClick={() => handleNavigation(subItem.id, subItem.path)}
                                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left text-white hover:bg-[#dde9f0] hover:text-[#255267] transition-colors group"
                                            >
                                                <subItem.icon className="mr-3 icon" sx={{ fontSize: 20, color: '#ffffff' }} />
                                                {subItem.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleNavigation(item.id, item.path)}
                                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left text-white hover:bg-[#dde9f0] hover:text-[#255267] transition-colors group"
                                    >
                                        <item.icon className="mr-3 icon" sx={{ fontSize: 20, color: '#ffffff' }} />
                                        {item.label}
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
