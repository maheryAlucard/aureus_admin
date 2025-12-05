import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Calendar, CheckCircle, Clock, Archive, ArrowLeft, 
  Building, DollarSign, MessageSquare, Save, Trash2, Send, FileText 
} from 'lucide-react';
import { getLeads, updateLead, deleteLead } from '../services/apiService';
import { Lead } from '../types';

const LeadsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  // Detail View State
  const [internalNotes, setInternalNotes] = useState('');
  const [status, setStatus] = useState<Lead['status']>('NEW');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setInternalNotes(lead.internalNotes || '');
    setStatus(lead.status);
    setViewMode('DETAIL');
  };

  const handleBackToList = () => {
    setSelectedLead(null);
    setViewMode('LIST');
  };

  const handleSaveChanges = async () => {
    if (!selectedLead) return;
    
    // Optimistic update
    const updatedLead = { 
        ...selectedLead, 
        status: status, 
        internalNotes: internalNotes 
    };
    
    setSelectedLead(updatedLead);
    
    // API Call
    await updateLead(selectedLead.id, { status, internalNotes });
    
    // Update list state
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
    
    alert('Lead updated successfully');
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
        await deleteLead(selectedLead.id);
        setLeads(prev => prev.filter(l => l.id !== selectedLead.id));
        handleBackToList();
    }
  };

  const StatusBadge = ({ status }: { status: Lead['status'] }) => {
    switch (status) {
        case 'NEW': return <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 flex items-center w-fit"><Clock size={12} className="mr-1"/> NEW</span>;
        case 'CONTACTED': return <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20 flex items-center w-fit"><MessageSquare size={12} className="mr-1"/> CONTACTED</span>;
        case 'CLOSED': return <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> CLOSED</span>;
        default: return null;
    }
  };

  const DivisionBadge = ({ division }: { division: Lead['division'] }) => (
    <span className={`text-xs font-medium px-2 py-1 rounded
        ${division === 'TECH' ? 'text-cyan-400 bg-cyan-900/20' : 
          division === 'STUDIO' ? 'text-fuchsia-400 bg-fuchsia-900/20' : 
          division === 'BRAND' ? 'text-indigo-400 bg-indigo-900/20' : 
          'text-slate-400 bg-slate-800'}`}>
        {division}
    </span>
  );

  // --- DETAIL VIEW ---
  if (viewMode === 'DETAIL' && selectedLead) {
    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <button 
                        onClick={handleBackToList}
                        className="mr-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white">{selectedLead.name}</h1>
                            <StatusBadge status={status} />
                        </div>
                        <p className="text-slate-400 text-sm mt-1 flex items-center">
                            Received on {selectedLead.receivedAt} • ID: #{selectedLead.id}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-lg shadow-indigo-500/20 transition-colors"
                    >
                        <Save size={16} className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2 pb-6">
                
                {/* Left Column: Info & Message */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Message Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <MessageSquare size={18} className="mr-2 text-indigo-400" />
                            Message
                        </h3>
                        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {selectedLead.message}
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <FileText size={18} className="mr-2 text-indigo-400" />
                            Lead Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                                <a href={`mailto:${selectedLead.email}`} className="text-indigo-400 hover:text-indigo-300 flex items-center">
                                    <Mail size={14} className="mr-2" /> {selectedLead.email}
                                </a>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                                <div className="text-slate-200 flex items-center">
                                    <Phone size={14} className="mr-2 text-slate-500" /> {selectedLead.phone || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Company</label>
                                <div className="text-slate-200 flex items-center">
                                    <Building size={14} className="mr-2 text-slate-500" /> {selectedLead.company || 'Individual'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Division Interest</label>
                                <div className="mt-1">
                                    <DivisionBadge division={selectedLead.division} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Budget Range</label>
                                <div className="text-slate-200 flex items-center">
                                    <DollarSign size={14} className="mr-2 text-slate-500" /> {selectedLead.budget || 'Not specified'}
                                </div>
                            </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Event Date / Deadline</label>
                                <div className="text-slate-200 flex items-center">
                                    <Calendar size={14} className="mr-2 text-slate-500" /> {selectedLead.eventDate || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Actions */}
                <div className="space-y-6">
                    {/* Management Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Status & Notes</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Current Status</label>
                                <div className="relative">
                                    <select 
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as Lead['status'])}
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none appearance-none"
                                    >
                                        <option value="NEW">New Lead</option>
                                        <option value="CONTACTED">Contacted</option>
                                        <option value="CLOSED">Closed / Finished</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">
                                    Internal Notes
                                    <span className="text-slate-500 text-xs ml-2 font-normal">(Not visible to lead)</span>
                                </label>
                                <textarea 
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-indigo-500 focus:outline-none h-40 resize-none text-sm leading-relaxed"
                                    placeholder="Add notes about conversations, requirements, or next steps..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <a 
                                href={`mailto:${selectedLead.email}?subject=Re: Inquiry for Aureus Digital&body=Hi ${selectedLead.name},%0D%0A%0D%0AThank you for reaching out to us regarding...`}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                            >
                                <Send size={16} className="mr-2" /> Reply via Email
                            </a>
                            <button 
                                onClick={() => alert('Devis generation module coming soon.')}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                            >
                                <FileText size={16} className="mr-2" /> Create Devis
                            </button>
                            <button 
                                onClick={() => alert('Project conversion module coming soon.')}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                            >
                                <Building size={16} className="mr-2" /> Convert to Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold text-white">Leads Management</h1>
           <p className="text-slate-400 mt-1">Track and manage incoming inquiries.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Name / Contact</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Division</th>
                            <th className="px-6 py-4 font-semibold">Budget</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading leads...</td></tr>
                        ) : leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleViewLead(lead)}>{lead.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center mt-1">
                                        <Mail size={12} className="mr-1" /> {lead.email}
                                    </div>
                                    {lead.company && (
                                        <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                            <Building size={12} className="mr-1" /> {lead.company}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={lead.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <DivisionBadge division={lead.division} />
                                </td>
                                <td className="px-6 py-4 text-slate-300 text-sm font-medium">
                                    {lead.budget || <span className="text-slate-600 italic">N/A</span>}
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {lead.receivedAt}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleViewLead(lead)}
                                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <FileText size={16} />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('Delete this lead?')) {
                                                    deleteLead(lead.id).then(() => {
                                                        setLeads(leads.filter(l => l.id !== lead.id));
                                                    });
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {!loading && leads.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No leads found.
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

export default LeadsManager;