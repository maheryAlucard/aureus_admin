import React, { useState, useEffect } from 'react';
import { 
  Mail, Search, Filter, Trash2, Download, UserMinus, 
  Send, Users, UserCheck, UserX, Calendar
} from 'lucide-react';
import { getSubscribers, unsubscribeSubscriber, deleteSubscriber } from '../services/apiService';
import { Subscriber } from '../types';

const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const data = await getSubscribers();
    setSubscribers(data);
    setLoading(false);
  };

  const handleUnsubscribe = async (id: string) => {
    if (window.confirm('Mark this user as unsubscribed?')) {
      await unsubscribeSubscriber(id);
      fetchSubscribers();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Permanently remove this subscriber from the database?')) {
      await deleteSubscriber(id);
      fetchSubscribers();
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Email', 'Source', 'Status', 'Subscribed At', 'Unsubscribed At'];
    const rows = filteredSubscribers.map(s => [
        s.id, s.email, s.source, s.status, s.subscribedAt, s.unsubscribedAt || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendNewsletter = () => {
      alert("Newsletter campaign feature coming soon (integration required).");
  };

  // --- Filtering & Stats ---
  const filteredSubscribers = subscribers.filter(s => {
      const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
      return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

  const stats = {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'ACTIVE').length,
      unsubscribed: subscribers.filter(s => s.status === 'UNSUBSCRIBED').length,
      newThisMonth: subscribers.filter(s => s.subscribedAt.startsWith(new Date().toISOString().slice(0, 7))).length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white">Newsletter Subscriptions</h1>
           <p className="text-slate-400 mt-1">Manage email list and subscribers.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleExportCSV}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors border border-slate-700"
            >
                <Download size={18} className="mr-2" /> Export CSV
            </button>
            <button 
                onClick={handleSendNewsletter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Send size={18} className="mr-2" /> Send Newsletter
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500"><Users size={24} /></div>
                  <span className="text-slate-500 text-xs">Total</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Total Subscribers</h3>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500"><UserCheck size={24} /></div>
                  <span className="text-emerald-400 text-xs flex items-center">+{(stats.active/stats.total*100).toFixed(0)}% rate</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Active Subscribers</h3>
              <p className="text-2xl font-bold text-white mt-1">{stats.active}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-500"><UserMinus size={24} /></div>
                  <span className="text-slate-500 text-xs">Unsubscribed</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">Unsubscribed</h3>
              <p className="text-2xl font-bold text-white mt-1">{stats.unsubscribed}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-500"><Calendar size={24} /></div>
                  <span className="text-cyan-400 text-xs">This Month</span>
              </div>
              <h3 className="text-slate-400 text-sm font-medium">New Subscribers</h3>
              <p className="text-2xl font-bold text-white mt-1">{stats.newThisMonth}</p>
          </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search by email..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
            <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="UNSUBSCRIBED">Unsubscribed</option>
            </select>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Email Address</th>
                        <th className="px-6 py-4 font-semibold">Source</th>
                        <th className="px-6 py-4 font-semibold">Subscribed Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading subscribers...</td></tr>
                    ) : filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-bold text-white flex items-center">
                                    <Mail size={16} className="text-slate-500 mr-2" />
                                    {sub.email}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                                {sub.source}
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                                {sub.subscribedAt}
                            </td>
                            <td className="px-6 py-4">
                                {sub.status === 'ACTIVE' ? (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-green-400 bg-green-500/10 rounded-full">
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-red-400 bg-red-500/10 rounded-full">
                                        Unsubscribed
                                    </span>
                                )}
                                {sub.unsubscribedAt && (
                                    <div className="text-xs text-slate-500 mt-1">on {sub.unsubscribedAt}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {sub.status === 'ACTIVE' && (
                                        <button 
                                            onClick={() => handleUnsubscribe(sub.id)}
                                            className="p-2 text-slate-400 hover:text-yellow-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Unsubscribe"
                                        >
                                            <UserX size={16} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(sub.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!loading && filteredSubscribers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No subscribers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManager;