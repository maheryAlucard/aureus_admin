import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Star, Upload, Video, 
  Quote, Building, User, Layout, ArrowLeft, Save, PlayCircle, MessageSquareQuote
} from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../services/apiService';
import { Testimonial, Division } from '../types';

const TestimonialsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');
  const [filterRating, setFilterRating] = useState<string>('ALL');

  // Form State
  const initialFormState: Partial<Testimonial> = {
    name: '',
    role: '',
    company: '',
    companyLogoUrl: '',
    photoUrl: '',
    content: '',
    rating: 5,
    division: 'TECH',
    videoUrl: ''
  };

  const [formData, setFormData] = useState<Partial<Testimonial>>(initialFormState);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  // --- FILTERING LOGIC ---
  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDivision = filterDivision === 'ALL' || t.division === filterDivision;
    
    let matchesRating = true;
    if (filterRating === '5') matchesRating = t.rating === 5;
    if (filterRating === '4+') matchesRating = t.rating >= 4;
    
    return matchesSearch && matchesDivision && matchesRating;
  }).sort((a, b) => {
      // Sort by Rating desc, then Date desc
      if (a.rating !== b.rating) return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // --- HANDLERS ---
  const handleCreateNew = () => {
    setFormData(initialFormState);
    setViewMode('FORM');
  };

  const handleEdit = (t: Testimonial) => {
    setFormData({ ...t });
    setViewMode('FORM');
  };

  const handleView = (t: Testimonial) => {
    setSelectedTestimonial(t);
    setViewMode('DETAIL');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonial(id);
      fetchTestimonials();
      if (viewMode === 'DETAIL') setViewMode('LIST');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
        ...formData,
        // Default avatars if empty
        photoUrl: formData.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Client')}&background=random`,
        companyLogoUrl: formData.companyLogoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.company || 'Co')}&background=transparent&color=fff&font-size=0.4`
    };

    if (formData.id) {
        await updateTestimonial(formData.id, payload);
    } else {
        await createTestimonial(payload as Omit<Testimonial, 'id' | 'createdAt'>);
    }

    await fetchTestimonials();
    setViewMode('LIST');
  };

  // --- COMPONENTS ---
  const StarRating = ({ rating, onChange, readOnly = false }: { rating: number, onChange?: (r: number) => void, readOnly?: boolean }) => {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && onChange && onChange(star)}
                    className={`focus:outline-none transition-colors ${readOnly ? 'cursor-default' : 'hover:scale-110'}`}
                >
                    <Star 
                        size={readOnly ? 16 : 24} 
                        className={`${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'} transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
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

  // --- VIEWS ---

  if (viewMode === 'DETAIL' && selectedTestimonial) {
      return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to List
                </button>
                <div className="flex gap-2">
                     <button 
                        onClick={() => handleDelete(selectedTestimonial.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium border border-red-500/20"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => handleEdit(selectedTestimonial)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Edit Testimonial
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preview Card */}
                <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Frontend Preview</h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative shadow-xl">
                        <Quote size={40} className="text-indigo-500/20 absolute top-4 left-4" />
                        <div className="relative z-10">
                            <div className="mb-4">
                                <StarRating rating={selectedTestimonial.rating} readOnly />
                            </div>
                            <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                                "{selectedTestimonial.content}"
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src={selectedTestimonial.photoUrl} 
                                    alt={selectedTestimonial.name} 
                                    className="w-10 h-10 rounded-full object-cover mr-3 border border-slate-700"
                                />
                                <div>
                                    <div className="text-white font-bold text-sm">{selectedTestimonial.name}</div>
                                    <div className="text-slate-500 text-xs">{selectedTestimonial.role}, {selectedTestimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Details */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6">
                        <div className="flex items-center">
                             <div className="h-16 w-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 mr-4 overflow-hidden">
                                {selectedTestimonial.companyLogoUrl ? (
                                    <img src={selectedTestimonial.companyLogoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Building size={24} className="text-slate-600" />
                                )}
                             </div>
                             <div>
                                <h2 className="text-2xl font-bold text-white">{selectedTestimonial.company}</h2>
                                <p className="text-slate-400 text-sm">Created on {selectedTestimonial.createdAt}</p>
                             </div>
                        </div>
                        <DivisionBadge division={selectedTestimonial.division || 'GENERAL'} />
                    </div>

                    <div className="space-y-6">
                        <div>
                             <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Content</h4>
                             <p className="text-lg text-slate-200 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-1 bg-slate-900/50">
                                "{selectedTestimonial.content}"
                             </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Client Contact</h4>
                                <div className="flex items-center p-3 bg-slate-800 rounded-lg">
                                    <User size={16} className="text-slate-400 mr-3" />
                                    <div>
                                        <div className="text-white text-sm font-medium">{selectedTestimonial.name}</div>
                                        <div className="text-slate-400 text-xs">{selectedTestimonial.role}</div>
                                    </div>
                                </div>
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Media</h4>
                                {selectedTestimonial.videoUrl ? (
                                    <a href={selectedTestimonial.videoUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors group">
                                        <PlayCircle size={16} className="text-indigo-400 mr-3 group-hover:scale-110 transition-transform" />
                                        <div className="text-indigo-400 text-sm truncate">Watch Video Review</div>
                                    </a>
                                ) : (
                                    <div className="text-slate-500 text-sm italic p-3">No video attached.</div>
                                )}
                             </div>
                        </div>
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
                        {formData.id ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} className="mr-2" />
                    Save
                </button>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Client Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Client Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Client Name <span className="text-red-400">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Client Role <span className="text-red-400">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-slate-300">Company Name <span className="text-red-400">*</span></label>
                             <input 
                                type="text" 
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                            />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Client Photo URL</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.photoUrl}
                                        onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                        placeholder="https://..."
                                    />
                                    <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 overflow-hidden flex items-center justify-center">
                                        {formData.photoUrl ? <img src={formData.photoUrl} className="w-full h-full object-cover" /> : <User size={16} className="text-slate-500"/>}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Company Logo URL</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.companyLogoUrl}
                                        onChange={e => setFormData({...formData, companyLogoUrl: e.target.value})}
                                        placeholder="https://..."
                                    />
                                    <div className="w-10 h-10 bg-slate-800 rounded border border-slate-700 overflow-hidden flex items-center justify-center">
                                        {formData.companyLogoUrl ? <img src={formData.companyLogoUrl} className="w-full h-full object-contain p-1" /> : <Building size={16} className="text-slate-500"/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Testimonial Content</h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Rating <span className="text-red-400">*</span></label>
                            <StarRating rating={formData.rating || 5} onChange={(r) => setFormData({...formData, rating: r})} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Content <span className="text-red-400">*</span></label>
                            <textarea 
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-32 focus:border-indigo-500 focus:outline-none resize-none"
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                placeholder="What did the client say..."
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-slate-500">{formData.content?.length}/500</div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Division</label>
                                <select 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.division}
                                    onChange={e => setFormData({...formData, division: e.target.value as any})}
                                >
                                    <option value="TECH">TECH</option>
                                    <option value="STUDIO">STUDIO</option>
                                    <option value="BRAND">BRAND</option>
                                    <option value="GENERAL">GENERAL</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Video URL (Optional)</label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>
                         </div>
                    </div>

                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h1 className="text-2xl font-bold text-white">Testimonials</h1>
            <p className="text-slate-400 mt-1">Manage client reviews and feedback.</p>
            </div>
            <button 
            onClick={handleCreateNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Plus size={20} className="mr-2" /> Add Testimonial
            </button>
        </div>

        {/* Toolbar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search by client, company or content..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
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
            <select 
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
                <option value="ALL">All Ratings</option>
                <option value="5">5 Stars Only</option>
                <option value="4+">4+ Stars</option>
            </select>
        </div>
      </div>

       {/* Testimonials Grid/Table */}
       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Client</th>
                        <th className="px-6 py-4 font-semibold">Company</th>
                        <th className="px-6 py-4 font-semibold">Rating</th>
                        <th className="px-6 py-4 font-semibold">Division</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading testimonials...</td></tr>
                    ) : filteredTestimonials.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group">
                             <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 mr-3 overflow-hidden flex-shrink-0">
                                        {t.photoUrl ? (
                                            <img src={t.photoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><User size={16} className="text-slate-500" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleView(t)}>
                                            {t.name}
                                        </div>
                                        <div className="text-xs text-slate-500">{t.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-300 text-sm">
                                {t.company}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < t.rating ? 'fill-current' : 'text-slate-700'} />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <DivisionBadge division={t.division || 'GENERAL'} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleView(t)}
                                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="View"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(t)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(t.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!loading && filteredTestimonials.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No testimonials found matching your filters.
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

export default TestimonialsManager;