import React from 'react';
// import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Dashboard from './pages/dashboard.jsx';
import LandingPage from './pages/landingPage.jsx';
import PrivacyPolicy from './pages/privacyPolicy.jsx';
import TermsOfService from './pages/termsOfService.jsx';
import HelpCenter from './pages/helpCenter.jsx';
import SupportPage from './pages/supportPage.jsx';
import CreateTemplate from './pages/Template/createTemplate.jsx';
import ViewTemplates from './pages/Template/viewTemplate.jsx';
import Message from './pages/Message/message.jsx';
import WebhookPage from './pages/webhookPage.jsx';
import ProfilePage from './pages/profile.jsx';
import UsageAnalytics from './pages/usageAnalytics.jsx';
import CreateFlow from './pages/Flow/createFlow.jsx';
import ViewFlows from './pages/Flow/viewFlow.jsx';
import ViewMessage from './pages/Message/viewMessage.jsx';

const routes = {
    dashboard: [
        { path: "/login", element: <Login /> },
        // { path: "/register", element: <Register /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/", element: <LandingPage /> },
        { path: "/privacy_policy", element: <PrivacyPolicy /> },
        { path: "/terms_of_service", element: <TermsOfService /> },
        { path: "/help_center", element: <HelpCenter /> },
        { path: "/support", element: <SupportPage /> },
        { path: "/create_template", element: <CreateTemplate /> },
        { path: "/view_templates", element: <ViewTemplates /> },
        { path: "/message", element: <Message /> },
        { path: "/webhook", element: <WebhookPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/usage_analytics", element: <UsageAnalytics /> },
        { path: "/create_flow", element: <CreateFlow /> },
        { path: "/view_flows", element: <ViewFlows /> },
        { path: "/view_messages", element: <ViewMessage /> }
    ],
};

export default routes;