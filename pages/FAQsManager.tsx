import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, ArrowLeft, Save, 
  HelpCircle, MessageCircle, MoreVertical
} from 'lucide-react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../services/apiService';
import { FAQ } from '../types';

const FAQsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Form State
  const initialFormState: Partial<FAQ> = {
    question: '',
    answer: '',
    category: 'General',
    displayOrder: 0
  };

  const [formData, setFormData] = useState<Partial<FAQ>>(initialFormState);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    const data = await getFAQs();
    setFaqs(data);
    setLoading(false);
  };

  // --- FILTERING LOGIC ---
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || faq.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  // --- HANDLERS ---
  const handleCreateNew = () => {
    setFormData(initialFormState);
    setViewMode('FORM');
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({ ...faq });
    setViewMode('FORM');
  };

  const handleView = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setViewMode('DETAIL');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      await deleteFAQ(id);
      fetchFAQs();
      if (viewMode === 'DETAIL') setViewMode('LIST');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    if (formData.id) {
        await updateFAQ(formData.id, formData);
    } else {
        await createFAQ(formData as Omit<FAQ, 'id'>);
    }

    await fetchFAQs();
    setViewMode('LIST');
  };

  // --- VIEWS ---

  if (viewMode === 'DETAIL' && selectedFAQ) {
      return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to FAQs
                </button>
                <div className="flex gap-2">
                     <button 
                        onClick={() => handleDelete(selectedFAQ.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium border border-red-500/20"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => handleEdit(selectedFAQ)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Edit FAQ
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-slate-800 text-indigo-400 rounded-full text-xs font-bold border border-slate-700 uppercase tracking-wider">
                        {selectedFAQ.category}
                    </span>
                    <span className="text-slate-500 text-xs">Order #{selectedFAQ.displayOrder}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
                    {selectedFAQ.question}
                </h2>
                
                <div className="prose prose-invert max-w-none">
                    <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedFAQ.answer}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (viewMode === 'FORM') {
      return (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-white">
                        {formData.id ? 'Edit FAQ' : 'Create New FAQ'}
                    </h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} className="mr-2" />
                    Save FAQ
                </button>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Question <span className="text-red-400">*</span></label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                            value={formData.question}
                            onChange={e => setFormData({...formData, question: e.target.value})}
                            placeholder="e.g. What is your refund policy?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Answer <span className="text-red-400">*</span></label>
                        <textarea 
                            required
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-48 focus:border-indigo-500 focus:outline-none resize-y leading-relaxed"
                            value={formData.answer}
                            onChange={e => setFormData({...formData, answer: e.target.value})}
                            placeholder="Provide a clear and concise answer..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Category</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="General">General</option>
                                <option value="Services">Services</option>
                                <option value="Process">Process</option>
                                <option value="Billing">Billing</option>
                                <option value="Support">Support</option>
                                <option value="Technical">Technical</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Display Order</label>
                            <input 
                                type="number" 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.displayOrder}
                                onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
                <p className="text-slate-400 mt-1">Manage Q&A for the support center.</p>
            </div>
            <button 
                onClick={handleCreateNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Plus size={20} className="mr-2" /> Add FAQ
            </button>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search questions..." 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                    <option value="ALL">All Categories</option>
                    <option value="General">General</option>
                    <option value="Services">Services</option>
                    <option value="Process">Process</option>
                    <option value="Billing">Billing</option>
                    <option value="Support">Support</option>
                    <option value="Technical">Technical</option>
                </select>
            </div>
        </div>

        {/* List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold w-16">#</th>
                            <th className="px-6 py-4 font-semibold">Question</th>
                            <th className="px-6 py-4 font-semibold">Answer</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading FAQs...</td></tr>
                        ) : filteredFAQs.map((faq) => (
                            <tr key={faq.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                                    {faq.displayOrder}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white max-w-xs truncate cursor-pointer hover:text-indigo-400" onClick={() => handleView(faq)}>
                                        {faq.question}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-400 text-sm max-w-md truncate">
                                        {faq.answer}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 border border-slate-700">
                                        {faq.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleView(faq)}
                                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(faq)}
                                            className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(faq.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredFAQs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No FAQs found.
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

export default FAQsManager;