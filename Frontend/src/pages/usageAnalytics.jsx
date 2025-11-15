import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Email,
    Group,
    Send,
    Schedule,
    Description,
    Category,
    CheckCircle,
    Visibility,
    Error,
    Download,
    CalendarToday,
    Person,
    Forum,
    Campaign,
    AccessTime
} from '@mui/icons-material';
import {
    BarChart,
    PieChart,
    LineChart,
    barElementClasses,
    lineElementClasses,
    pieArcLabelClasses
} from '@mui/x-charts';
import Sidebar from '../component/sidebar';
import Header from '../component/header';

const UsageAnalytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('analytics');
    const [templateCategoryFilter, setTemplateCategoryFilter] = useState('all');

    // Dummy data for demonstration
    const [analyticsData, setAnalyticsData] = useState({
        messageStats: {},
        templateUsage: {},
        deliveryReports: {},
        summaryStats: {},
        messageSummary: {},
        deliverySummary: {}
    });

    // Generate dummy data
    useEffect(() => {
        const generateDummyData = () => {
            // Chart-specific data (fixed to 30 days)
            const messageDays = 30;
            const deliveryDays = 30;
            const messageStatsData = [];
            const deliveryData = [];

            // Message Stats Data (BarChart)
            for (let i = 0; i < messageDays; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (messageDays - 1 - i));

                messageStatsData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    singleUser: Math.floor(Math.random() * 500) + 100,
                    group: Math.floor(Math.random() * 300) + 50,
                    bulk: Math.floor(Math.random() * 1000) + 200,
                });
            }

            // Delivery Data (LineChart) starting from June 1st, 2025
            const startDate = new Date(2025, 5, 1); // June 1st, 2025
            for (let i = 0; i < deliveryDays; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);

                const delivered = Math.floor(Math.random() * 1000) + 500;
                const read = Math.floor(delivered * (0.7 + Math.random() * 0.2));
                const failed = Math.floor(delivered * (0.02 + Math.random() * 0.03));

                deliveryData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    delivered,
                    read,
                    failed,
                    deliveredPercentage: Math.round((delivered / (delivered + failed)) * 100),
                    readPercentage: Math.round((read / delivered) * 100)
                });
            }

            // Summary Stats Data (fixed 30 days for Summary Cards and stat cards)
            const summaryDays = 30;
            const summaryMessageData = [];
            const summaryDeliveryData = [];

            for (let i = 0; i < summaryDays; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (summaryDays - 1 - i));

                summaryMessageData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    singleUser: Math.floor(Math.random() * 500) + 100,
                    group: Math.floor(Math.random() * 300) + 50,
                    bulk: Math.floor(Math.random() * 1000) + 200,
                    template: Math.floor(Math.random() * 600) + 150,
                });
            }

            for (let i = 0; i < summaryDays; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);

                const delivered = Math.floor(Math.random() * 1000) + 500;
                const read = Math.floor(delivered * (0.7 + Math.random() * 0.2));
                const failed = Math.floor(delivered * (0.02 + Math.random() * 0.03));

                summaryDeliveryData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    delivered,
                    read,
                    failed,
                    deliveredPercentage: Math.round((delivered / (delivered + failed)) * 100),
                    readPercentage: Math.round((read / delivered) * 100)
                });
            }

            const templateCategories = [
                { id: 0, value: 50, label: 'Utility', count: 15, color: '#3B82F6' },
                { id: 1, value: 30, label: 'Marketing', count: 10, color: '#F59E0B' },
                { id: 2, value: 20, label: 'Authentication', count: 5, color: '#10B981' }
            ];

            const summaryStats = {
                totalMessages: summaryMessageData.reduce((sum, day) =>
                    sum + day.singleUser + day.group + day.bulk, 0),
                totalTemplatesSent: summaryMessageData.reduce((sum, day) => sum + day.template, 0),
                deliveryRate: Math.round(summaryDeliveryData.reduce((sum, day) => sum + day.deliveredPercentage, 0) / summaryDays),
                readRate: Math.round(summaryDeliveryData.reduce((sum, day) => sum + day.readPercentage, 0) / summaryDays),
                templatesCreated: templateCategories.reduce((sum, cat) => sum + cat.count, 0)
            };

            const messageSummary = {
                singleUser: summaryMessageData.reduce((sum, day) => sum + day.singleUser, 0),
                group: summaryMessageData.reduce((sum, day) => sum + day.group, 0),
                bulk: summaryMessageData.reduce((sum, day) => sum + day.bulk, 0),
            };

            const deliverySummary = {
                delivered: summaryDeliveryData.reduce((sum, day) => sum + day.delivered, 0),
                read: summaryDeliveryData.reduce((sum, day) => sum + day.read, 0),
                failed: summaryDeliveryData.reduce((sum, day) => sum + day.failed, 0),
                deliveryRate: summaryStats.deliveryRate,
                readRate: summaryStats.readRate
            };

            setAnalyticsData({
                messageStats: {
                    daily: messageStatsData,
                    summary: messageSummary
                },
                templateUsage: {
                    byCategory: templateCategories,
                    totalTemplatesUsed: summaryStats.totalTemplatesSent,
                    templatesCreated: summaryStats.templatesCreated
                },
                deliveryReports: {
                    daily: deliveryData,
                    summary: deliverySummary
                },
                summaryStats,
                messageSummary,
                deliverySummary
            });
        };

        generateDummyData();
    }, []); // Empty dependency array since filters are removed

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    // Prepare data for MUI charts
    const messageChartData = analyticsData.messageStats.daily || [];
    const deliveryChartData = analyticsData.deliveryReports.daily || [];
    const templateData = analyticsData.templateUsage.byCategory || [];
    const filteredTemplateData = templateCategoryFilter === 'all'
        ? templateData
        : templateData.filter(category => category.label === templateCategoryFilter);

    // Colors for charts
    const MESSAGE_TYPE_COLORS = {
        singleUser: '#0088FE',
        group: '#00C49F',
        bulk: '#FFBB28',
    };

    const DELIVERY_COLORS = {
        delivered: '#10B981',
        read: '#3B82F6',
        failed: '#EF4444'
    };

    return (
        <div className="flex h-screen bg-[#dde9f0] overflow-hidden">
            <style>
                {`
                    .scrollbar-hidden::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hidden {
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
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    activeNavItem={activeNavItem}
                    toggleSidebar={toggleSidebar}
                    userDropdownOpen={userDropdownOpen}
                    toggleUserDropdown={toggleUserDropdown}
                />
                <main className="flex-1 overflow-y-auto bg-[#dde9f0] p-4 sm:p-6">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6 mb-6">
                            <div className="flex justify-between items-center flex-col md:flex-row gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Usage Analytics</h1>
                                    <p className="mt-2 text-gray-600 text-sm sm:text-base">Track your WhatsApp Business account performance and message statistics</p>
                                </div>
                                <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-100">
                                        <Download className="mr-2" /> Export
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                                        <Send className="text-blue-500" />
                                    </div>
                                    <span className="text-gray-600 font-medium text-sm sm:text-base">Total Messages</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{analyticsData.summaryStats?.totalMessages?.toLocaleString() || '0'}</h3>
                                <div className="flex items-center text-green-600 text-xs sm:text-sm mt-2">
                                    <TrendingUp className="text-base mr-1" />
                                    <span>12.5% from previous period</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                                        <Description className="text-green-500" />
                                    </div>
                                    <span className="text-gray-600 font-medium text-sm sm:text-base">Templates Sent</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{analyticsData.summaryStats?.totalTemplatesSent?.toLocaleString() || '0'}</h3>
                                <div className="flex items-center text-green-600 text-xs sm:text-sm mt-2">
                                    <TrendingUp className="text-base mr-1" />
                                    <span>8.3% from previous period</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-50 flex items-center justify-center mr-4">
                                        <CheckCircle className="text-emerald-600" />
                                    </div>
                                    <span className="text-gray-600 font-medium text-sm sm:text-base">Delivery Rate</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{analyticsData.summaryStats?.deliveryRate || '0'}%</h3>
                                <div className="flex items-center text-green-600 text-xs sm:text-sm mt-2">
                                    <TrendingUp className="text-base mr-1" />
                                    <span>2.1% from previous period</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                                        <Visibility className="text-blue-500" />
                                    </div>
                                    <span className="text-gray-600 font-medium text-sm sm:text-base">Read Rate</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{analyticsData.summaryStats?.readRate || '0'}%</h3>
                                <div className="flex items-center text-green-600 text-xs sm:text-sm mt-2">
                                    <TrendingUp className="text-base mr-1" />
                                    <span>3.7% from previous period</span>
                                </div>
                            </div>
                        </div>

                        {/* Message Stats Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6 mb-6">
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Message Statistics</h2>
                            </div>
                            <div className="h-[300px] sm:h-[400px] w-full max-w-full overflow-x-auto scrollbar-hidden">
                                <BarChart
                                    dataset={messageChartData}
                                    xAxis={[{
                                        scaleType: 'band',
                                        dataKey: 'date',
                                        label: 'Date',
                                    }]}
                                    series={[
                                        { dataKey: 'singleUser', label: 'Single User', color: MESSAGE_TYPE_COLORS.singleUser },
                                        { dataKey: 'group', label: 'Group', color: MESSAGE_TYPE_COLORS.group },
                                        { dataKey: 'bulk', label: 'Bulk', color: MESSAGE_TYPE_COLORS.bulk },
                                    ]}
                                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                                    sx={{
                                        [`& .${barElementClasses.root}`]: {
                                            rx: 4,
                                        },
                                    }}
                                    width={Math.min(messageChartData.length * 50, 1200)}
                                    height={400}
                                />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
                                {analyticsData.messageSummary && Object.entries(analyticsData.messageSummary).map(([key, value]) => (
                                    <div key={key} className="p-3 border border-gray-200 rounded-lg">
                                        <span className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-1">{value.toLocaleString()}</h3>
                                        <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${(value / analyticsData.summaryStats.totalMessages) * 100}%`,
                                                    backgroundColor: MESSAGE_TYPE_COLORS[key]
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6">
                            {/* Enhanced Template Usage Section */}
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Template Usage</h2>
                                    <div className="relative flex items-center w-full sm:w-[200px]">
                                        <Category className="absolute left-2 text-gray-600" />
                                        <select
                                            value={templateCategoryFilter}
                                            onChange={(e) => setTemplateCategoryFilter(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700"
                                        >
                                            <option value="all">All Categories</option>
                                            {templateData.map(category => (
                                                <option key={category.id} value={category.label}>{category.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                                    <div className="w-full lg:w-[300px] h-[250px] sm:h-[300px] max-w-full">
                                        <PieChart
                                            series={[{
                                                data: filteredTemplateData,
                                                innerRadius: 30,
                                                outerRadius: 100,
                                                paddingAngle: 2,
                                                cornerRadius: 5,
                                                arcLabel: (item) => `${item.value}%`,
                                                arcLabelMinAngle: 15,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                                            }]}
                                            sx={{
                                                [`& .${pieArcLabelClasses.root}`]: {
                                                    fill: 'white',
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                            margin={{ right: 5 }}
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        {templateData.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center mb-4 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200 cursor-pointer"
                                                onClick={() => setTemplateCategoryFilter(category.label)}
                                            >
                                                <span
                                                    className="w-3 h-3 rounded-sm mr-2"
                                                    style={{ backgroundColor: category.color }}
                                                ></span>
                                                <span className="text-gray-600 flex-grow text-sm sm:text-base">{category.label}</span>
                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">{category.count} templates</span>
                                            </div>
                                        ))}
                                        <hr className="my-4 border-gray-200" />
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600 text-sm sm:text-base">Total Templates Created:</span>
                                            <span className="font-semibold text-gray-800 text-sm sm:text-base">{analyticsData.templateUsage.templatesCreated}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-sm sm:text-base">Total Templates Sent:</span>
                                            <span className="font-semibold text-gray-800 text-sm sm:text-base">{analyticsData.templateUsage.totalTemplatesUsed?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                        {templateCategoryFilter === 'all' ? 'All Categories' : templateCategoryFilter} Summary
                                    </h3>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm sm:text-base">Templates Used:</span>
                                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {templateCategoryFilter === 'all'
                                                ? analyticsData.templateUsage.totalTemplatesUsed?.toLocaleString()
                                                : filteredTemplateData[0]?.count || '0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-gray-600 text-sm sm:text-base">Percentage:</span>
                                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {templateCategoryFilter === 'all'
                                                ? '100%'
                                                : `${filteredTemplateData[0]?.value || '0'}%`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Reports Section */}
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 sm:p-6">
                                <div className="mb-6">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Delivery Reports</h2>
                                </div>
                                <div className="h-[250px] sm:h-[300px] w-full max-w-full overflow-x-auto scrollbar-hidden mb-6">
                                    <LineChart
                                        dataset={deliveryChartData}
                                        xAxis={[{
                                            scaleType: 'band',
                                            dataKey: 'date',
                                            label: 'Date',
                                        }]}
                                        series={[{
                                            dataKey: 'delivered',
                                            label: 'Delivered',
                                            color: DELIVERY_COLORS.delivered,
                                            showMark: false
                                        }, {
                                            dataKey: 'read',
                                            label: 'Read',
                                            color: DELIVERY_COLORS.read,
                                            showMark: false
                                        }, {
                                            dataKey: 'failed',
                                            label: 'Failed',
                                            color: DELIVERY_COLORS.failed,
                                            showMark: false
                                        }]}
                                        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                                        sx={{
                                            [`& .${lineElementClasses.root}`]: {
                                                strokeWidth: 2,
                                            },
                                        }}
                                        width={Math.min(deliveryChartData.length * 50, 1200)}
                                        height={300}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                                        <CheckCircle className="text-2xl sm:text-3xl mb-2" style={{ color: DELIVERY_COLORS.delivered }} />
                                        <span className="text-gray-600 text-xs sm:text-sm">Delivered</span>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 my-1">{analyticsData.deliverySummary?.delivered?.toLocaleString()}</h3>
                                        <span className="text-green-600 text-xs sm:text-sm">{analyticsData.deliverySummary?.deliveryRate}% rate</span>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                                        <Visibility className="text-2xl sm:text-3xl mb-2" style={{ color: DELIVERY_COLORS.read }} />
                                        <span className="text-gray-600 text-xs sm:text-sm">Read</span>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 my-1">{analyticsData.deliverySummary?.read?.toLocaleString()}</h3>
                                        <span className="text-green-600 text-xs sm:text-sm">{analyticsData.deliverySummary?.readRate}% rate</span>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                                        <Error className="text-2xl sm:text-3xl mb-2" style={{ color: DELIVERY_COLORS.failed }} />
                                        <span className="text-gray-600 text-xs sm:text-sm">Failed</span>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 my-1">{analyticsData.deliverySummary?.failed?.toLocaleString()}</h3>
                                        <span className="text-red-600 text-xs sm:text-sm">
                                            {analyticsData.deliverySummary?.failed > 0 ?
                                                Math.round((analyticsData.deliverySummary.failed /
                                                    (analyticsData.deliverySummary.delivered + analyticsData.deliverySummary.failed)) * 100) : 0}% rate
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UsageAnalytics;