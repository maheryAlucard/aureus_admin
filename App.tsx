

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProjectsManager from './pages/ProjectsManager';
import LeadsManager from './pages/LeadsManager';
import BlogManager from './pages/BlogManager';
import TeamManager from './pages/TeamManager';
import TestimonialsManager from './pages/TestimonialsManager';
import PricingManager from './pages/PricingManager';
import FAQsManager from './pages/FAQsManager';
import DevisManager from './pages/DevisManager';
import NewsletterManager from './pages/NewsletterManager';
import ContentManager from './pages/ContentManager';
import SettingsManager from './pages/SettingsManager';
import AnalyticsManager from './pages/AnalyticsManager';
import UserManager from './pages/UserManager';
import Login from './pages/Login';
import ComingSoon from './pages/ComingSoon';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="leads" element={<LeadsManager />} />
          <Route path="devis" element={<DevisManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="faqs" element={<FAQsManager />} />
          <Route path="newsletter" element={<NewsletterManager />} />
          <Route path="settings" element={<SettingsManager />} />
          <Route path="analytics" element={<AnalyticsManager />} />
          <Route path="users" element={<UserManager />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;