

import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  PieChart,
  MessageSquare,
  Search,
  Zap,
  HelpCircle,
  MessageSquareQuote,
  CreditCard,
  ClipboardList,
  Mail,
  LayoutTemplate,
  Shield
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2 my-1
        ${isActive 
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    // Logic to clear token would go here
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 hover:lg:w-64 group'}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
           <div className={`flex items-center font-bold text-xl tracking-tighter text-white ${!isSidebarOpen && 'lg:hidden group-hover:lg:flex'}`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AUREUS</span>
              <span className="ml-2 text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">ADMIN</span>
           </div>
           {!isSidebarOpen && <div className="hidden lg:block text-indigo-400 font-bold text-2xl group-hover:hidden">A</div>}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarItem to="/admin/content" icon={<LayoutTemplate size={20} />} label="Content" />
          <SidebarItem to="/admin/projects" icon={<Briefcase size={20} />} label="Projects" />
          <SidebarItem to="/admin/leads" icon={<Zap size={20} />} label="Leads" />
          <SidebarItem to="/admin/devis" icon={<ClipboardList size={20} />} label="Devis / Quotes" />
          <SidebarItem to="/admin/newsletter" icon={<Mail size={20} />} label="Newsletter" />
          <SidebarItem to="/admin/blog" icon={<FileText size={20} />} label="Blog" />
          <SidebarItem to="/admin/analytics" icon={<PieChart size={20} />} label="Analytics" />
          <SidebarItem to="/admin/team" icon={<Users size={20} />} label="Team" />
          <SidebarItem to="/admin/pricing" icon={<CreditCard size={20} />} label="Pricing" />
          <SidebarItem to="/admin/testimonials" icon={<MessageSquareQuote size={20} />} label="Testimonials" />
          <SidebarItem to="/admin/faqs" icon={<HelpCircle size={20} />} label="FAQs" />
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            <h3 className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'lg:hidden group-hover:lg:block'}`}>
              System
            </h3>
            <SidebarItem to="/admin/users" icon={<Shield size={20} />} label="Users" />
            <SidebarItem to="/admin/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 rounded-lg hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span className={`${!isSidebarOpen && 'lg:hidden group-hover:lg:inline'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center w-full lg:w-auto justify-end space-x-4">
             {/* Search Bar */}
             <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 w-64"
                />
             </div>

             {/* Notifications/User */}
             <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-400 hover:text-white">
                  <MessageSquare size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
           {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;