import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, Download, Send, ArrowLeft, Building, 
  Calendar, DollarSign, FileText, CheckCircle, Clock, XCircle, 
  Briefcase, Mail, Trash2, Edit, Save, RefreshCw
} from 'lucide-react';
import { getDevis, deleteDevis, updateDevis } from '../services/apiService';
import { Devis } from '../types';

const DevisManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');

  // Edit State
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchDevis();
  }, []);

  const fetchDevis = async () => {
    setLoading(true);
    const data = await getDevis();
    setDevisList(data);
    setLoading(false);
  };

  // Filter Logic
  const filteredDevis = devisList.filter(d => {
    const matchesSearch = 
        d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.companyName && d.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'ALL' || d.division === filterDivision;
    return matchesSearch && matchesDivision;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Handlers
  const handleView = (devis: Devis) => {
    setSelectedDevis(devis);
    setEditContent(devis.generatedContent);
    setIsEditingContent(false);
    setViewMode('DETAIL');
  };

  const handleBack = () => {
    setViewMode('LIST');
    setSelectedDevis(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
        await deleteDevis(id);
        fetchDevis();
        if (viewMode === 'DETAIL') handleBack();
    }
  };

  const handleSaveContent = async () => {
      if (!selectedDevis) return;
      await updateDevis(selectedDevis.id, { generatedContent: editContent });
      
      // Update local state
      setSelectedDevis({...selectedDevis, generatedContent: editContent});
      setIsEditingContent(false);
      fetchDevis(); // Refresh list in background
      alert('Content saved successfully.');
  };

  const handleDownloadPDF = () => {
      alert(`Downloading PDF for ${selectedDevis?.id}... (Mock functionality)`);
  };

  const handleSendEmail = async () => {
      if (!selectedDevis) return;
      if (window.confirm(`Send quote ${selectedDevis.id} to ${selectedDevis.clientEmail}?`)) {
          await updateDevis(selectedDevis.id, { status: 'SENT' });
          setSelectedDevis({...selectedDevis, status: 'SENT'});
          fetchDevis();
          alert(`Email sent to ${selectedDevis.clientEmail}.`);
      }
  };

  const handleConvertToProject = () => {
      alert('Convert to Project functionality coming soon.');
  };

  // Components
  const StatusBadge = ({ status }: { status: Devis['status'] }) => {
      switch (status) {
          case 'DRAFT': return <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><Clock size={12} className="mr-1"/> DRAFT</span>;
          case 'SENT': return <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20 flex items-center w-fit"><Send size={12} className="mr-1"/> SENT</span>;
          case 'ACCEPTED': return <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> ACCEPTED</span>;
          case 'REJECTED': return <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20 flex items-center w-fit"><XCircle size={12} className="mr-1"/> REJECTED</span>;
          default: return null;
      }
  };

  const DivisionBadge = ({ division }: { division: string }) => (
    <span className={`text-xs font-bold px-2 py-0.5 rounded
        ${division === 'TECH' ? 'text-cyan-400 bg-cyan-900/20 border border-cyan-500/20' : 
          division === 'STUDIO' ? 'text-fuchsia-400 bg-fuchsia-900/20 border border-fuchsia-500/20' : 
          division === 'BRAND' ? 'text-indigo-400 bg-indigo-900/20 border border-indigo-500/20' : 
          'text-slate-400 bg-slate-800 border border-slate-700'}`}>
        {division}
    </span>
  );

  // --- DETAIL VIEW ---
  if (viewMode === 'DETAIL' && selectedDevis) {
      return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <button onClick={handleBack} className="mr-4 text-slate-400 hover:text-white transition-colors p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white">{selectedDevis.id}</h1>
                            <StatusBadge status={selectedDevis.status} />
                        </div>
                        <p className="text-slate-400 text-sm mt-1">Created on {selectedDevis.createdAt}</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                     <button 
                        onClick={() => handleDelete(selectedDevis.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium border border-red-500/20 flex items-center"
                    >
                        <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                    <button 
                        onClick={handleConvertToProject}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium border border-slate-700 flex items-center"
                    >
                        <Briefcase size={16} className="mr-2" /> Convert to Project
                    </button>
                    <button 
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700 flex items-center"
                    >
                        <Download size={16} className="mr-2" /> PDF
                    </button>
                    <button 
                        onClick={handleSendEmail}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 flex items-center"
                    >
                        <Send size={16} className="mr-2" /> Send Email
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2 pb-6">
                
                {/* Left Column: Meta Info */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <Briefcase size={18} className="mr-2 text-indigo-400" />
                            Client Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Client Name</label>
                                <div className="text-slate-200">{selectedDevis.clientName}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Company</label>
                                <div className="text-slate-200 flex items-center">
                                    <Building size={14} className="mr-2 text-slate-500" /> 
                                    {selectedDevis.companyName || 'N/A'}
                                </div>
                            </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email</label>
                                <a href={`mailto:${selectedDevis.clientEmail}`} className="text-indigo-400 hover:underline flex items-center">
                                    <Mail size={14} className="mr-2" /> 
                                    {selectedDevis.clientEmail}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Project Specs */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <FileText size={18} className="mr-2 text-indigo-400" />
                            Project Specs
                        </h3>
                        <div className="space-y-4">
                             <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Division</label>
                                <DivisionBadge division={selectedDevis.division} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Description</label>
                                <p className="text-slate-300 text-sm leading-relaxed">{selectedDevis.projectDescription}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Budget</label>
                                    <div className="text-slate-200 flex items-center">
                                        <DollarSign size={14} className="mr-1 text-slate-500" /> {selectedDevis.budget}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Deadline</label>
                                    <div className="text-slate-200 flex items-center">
                                        <Calendar size={14} className="mr-1 text-slate-500" /> {selectedDevis.deadline || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            {selectedDevis.additionalRequirements && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Requirements</label>
                                    <p className="text-slate-400 text-xs italic">{selectedDevis.additionalRequirements}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quote Content */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[600px] lg:h-auto shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                        <h3 className="font-bold text-white">Generated Document</h3>
                        {isEditingContent ? (
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        setIsEditingContent(false);
                                        setEditContent(selectedDevis.generatedContent);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveContent}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded flex items-center"
                                >
                                    <Save size={12} className="mr-1" /> Save
                                </button>
                             </div>
                        ) : (
                            <button 
                                onClick={() => setIsEditingContent(true)}
                                className="px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 rounded border border-indigo-500/20 flex items-center"
                            >
                                <Edit size={12} className="mr-1" /> Edit Content
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-white text-slate-900">
                        {isEditingContent ? (
                            <textarea 
                                className="w-full h-full p-4 font-mono text-sm border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none bg-slate-50 text-slate-900"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        ) : (
                            <div className="prose max-w-none">
                                {/* Simulating Markdown Rendering simply by preserving whitespace for now */}
                                <pre className="font-sans whitespace-pre-wrap">{selectedDevis.generatedContent}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Devis Management</h1>
                <p className="text-slate-400 mt-1">Track and manage generated quotes.</p>
            </div>
             <button 
                onClick={fetchDevis}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                title="Refresh"
            >
                <RefreshCw size={20} />
            </button>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by client, company or ID..." 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="flex gap-2">
                <select 
                    value={filterDivision}
                    onChange={(e) => setFilterDivision(e.target.value)}
                    className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                    <option value="ALL">All Divisions</option>
                    <option value="TECH">Tech</option>
                    <option value="STUDIO">Studio</option>
                    <option value="BRAND">Brand</option>
                    <option value="GENERAL">General</option>
                </select>
            </div>
        </div>

        {/* List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Client / Company</th>
                            <th className="px-6 py-4 font-semibold">Division</th>
                            <th className="px-6 py-4 font-semibold">Budget</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                             <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading quotes...</td></tr>
                        ) : filteredDevis.map((devis) => (
                            <tr key={devis.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleView(devis)}>
                                        {devis.clientName}
                                    </div>
                                    <div className="text-xs text-slate-500">{devis.companyName}</div>
                                    <div className="text-xs text-slate-600 mt-0.5">{devis.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <DivisionBadge division={devis.division} />
                                </td>
                                <td className="px-6 py-4 text-slate-300 text-sm">
                                    {devis.budget}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={devis.status} />
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {devis.createdAt}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleView(devis)}
                                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="View & Edit"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            onClick={() => alert(`Mock Download PDF for ${devis.id}`)}
                                            className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Download PDF"
                                        >
                                            <Download size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(devis.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredDevis.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No quotes found.
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

export default DevisManager;