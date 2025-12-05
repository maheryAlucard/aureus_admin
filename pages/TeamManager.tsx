import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, User, Linkedin, Mail, Twitter,
  CheckCircle, ArrowLeft, Save, Upload, Star, MoreVertical, X, Layout
} from 'lucide-react';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../services/apiService';
import { TeamMember, Division } from '../types';

const TeamManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');
  const [filterFeatured, setFilterFeatured] = useState<boolean | 'ALL'>('ALL');

  // Form State
  const initialFormState: Partial<TeamMember> = {
    name: '',
    role: '',
    division: 'TECH',
    bio: '',
    photoUrl: '',
    expertise: [],
    linkedinUrl: '',
    email: '',
    twitterUrl: '',
    featured: false,
    displayOrder: 0
  };

  const [formData, setFormData] = useState<Partial<TeamMember>>(initialFormState);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'EXPERTISE' | 'SOCIAL'>('PROFILE');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const data = await getTeamMembers();
    setMembers(data);
    setLoading(false);
  };

  // --- FILTERING LOGIC ---
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'ALL' || member.division === filterDivision;
    const matchesFeatured = filterFeatured === 'ALL' || member.featured === filterFeatured;
    return matchesSearch && matchesDivision && matchesFeatured;
  }).sort((a, b) => {
     // Sort by featured first, then display order, then name
     if (a.featured !== b.featured) return a.featured ? -1 : 1;
     if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
     return a.name.localeCompare(b.name);
  });

  // --- HANDLERS ---
  const handleCreateNew = () => {
    setFormData(initialFormState);
    setViewMode('FORM');
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({ ...member });
    setViewMode('FORM');
  };

  const handleView = (member: TeamMember) => {
    setSelectedMember(member);
    setViewMode('DETAIL');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      await deleteTeamMember(id);
      fetchMembers();
      if (viewMode === 'DETAIL') setViewMode('LIST');
    }
  };

  const handleToggleFeatured = async (member: TeamMember) => {
    const newStatus = !member.featured;
    await updateTeamMember(member.id, { featured: newStatus });
    fetchMembers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default avatar if none provided
    const payload = {
        ...formData,
        photoUrl: formData.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random`,
        expertise: formData.expertise || [],
    };

    if (formData.id) {
        await updateTeamMember(formData.id, payload);
    } else {
        await createTeamMember(payload as Omit<TeamMember, 'id'>);
    }

    await fetchMembers();
    setViewMode('LIST');
  };

  // Tag Helpers
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
        e.preventDefault();
        setFormData(prev => ({...prev, expertise: [...(prev.expertise || []), tagInput]}));
        setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    setFormData(prev => ({...prev, expertise: prev.expertise?.filter(t => t !== tag)}));
  };

  // --- RENDERERS ---

  const DivisionBadge = ({ division }: { division: string }) => (
    <span className={`text-xs font-bold px-2 py-0.5 rounded
        ${division === 'TECH' ? 'text-cyan-400 bg-cyan-900/20 border border-cyan-500/20' : 
          division === 'STUDIO' ? 'text-fuchsia-400 bg-fuchsia-900/20 border border-fuchsia-500/20' : 
          division === 'BRAND' ? 'text-indigo-400 bg-indigo-900/20 border border-indigo-500/20' : 
          'text-slate-400 bg-slate-800 border border-slate-700'}`}>
        {division}
    </span>
  );

  // DETAIL VIEW
  if (viewMode === 'DETAIL' && selectedMember) {
    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Team
                </button>
                <div className="flex gap-2">
                     <button 
                        onClick={() => handleDelete(selectedMember.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium border border-red-500/20"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => handleEdit(selectedMember)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card Preview */}
                <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Card Preview</h3>
                    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl group hover:border-indigo-500/50 transition-colors">
                        <div className="aspect-square bg-slate-800 relative overflow-hidden">
                             <img src={selectedMember.photoUrl} alt={selectedMember.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                             <div className="absolute top-3 right-3">
                                 <DivisionBadge division={selectedMember.division} />
                             </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white mb-1">{selectedMember.name}</h3>
                            <p className="text-indigo-400 text-sm font-medium mb-4">{selectedMember.role}</p>
                            <div className="flex space-x-3">
                                {selectedMember.linkedinUrl && <a href="#" className="text-slate-400 hover:text-white"><Linkedin size={18}/></a>}
                                {selectedMember.email && <a href="#" className="text-slate-400 hover:text-white"><Mail size={18}/></a>}
                                {selectedMember.twitterUrl && <a href="#" className="text-slate-400 hover:text-white"><Twitter size={18}/></a>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Info */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                {selectedMember.name}
                                {selectedMember.featured && <Star size={18} className="text-yellow-500 fill-yellow-500 ml-2" />}
                            </h2>
                            <p className="text-lg text-slate-400 mt-1">{selectedMember.role}</p>
                        </div>
                        <div className="text-right">
                             <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Division</div>
                             <DivisionBadge division={selectedMember.division} />
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</h4>
                            <p className="text-slate-300 leading-relaxed">
                                {selectedMember.bio}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedMember.expertise.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-md text-sm border border-slate-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email</h4>
                                <div className="text-slate-300">{selectedMember.email || 'N/A'}</div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn</h4>
                                <div className="text-slate-300 truncate">{selectedMember.linkedinUrl || 'N/A'}</div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Display Order</h4>
                                <div className="text-slate-300">#{selectedMember.displayOrder}</div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
  }

  // FORM VIEW
  if (viewMode === 'FORM') {
    return (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-white">
                        {formData.id ? `Edit Member: ${formData.name}` : 'Add Team Member'}
                    </h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} className="mr-2" />
                    Save Member
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                {[
                    { id: 'PROFILE', label: 'Profile' },
                    { id: 'EXPERTISE', label: 'Expertise' },
                    { id: 'SOCIAL', label: 'Social & Settings' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors
                        ${activeTab === tab.id 
                            ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
                    
                    {/* PROFILE TAB */}
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                             <div className="flex gap-6 items-start">
                                <div className="w-32 h-32 rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center relative group">
                                    {formData.photoUrl ? (
                                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-slate-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-xs text-white">Preview</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                     <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Photo URL <span className="text-red-400">*</span></label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                required
                                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                                value={formData.photoUrl}
                                                onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                                                placeholder="https://..."
                                            />
                                            <button type="button" className="bg-slate-800 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white">
                                                <Upload size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Use a square image for best results. Recommended 400x400px.
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Full Name <span className="text-red-400">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Role / Title <span className="text-red-400">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                        placeholder="e.g. Senior Designer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Division <span className="text-red-400">*</span></label>
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
                                <label className="text-sm font-medium text-slate-300">Bio <span className="text-red-400">*</span></label>
                                <textarea 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-32 focus:border-indigo-500 focus:outline-none resize-none"
                                    value={formData.bio}
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                    placeholder="Short professional biography (max 500 chars)..."
                                    maxLength={500}
                                />
                                <div className="text-right text-xs text-slate-500">{formData.bio?.length}/500</div>
                            </div>
                        </div>
                    )}

                    {/* EXPERTISE TAB */}
                    {activeTab === 'EXPERTISE' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Expertise Tags</label>
                                <p className="text-xs text-slate-500 mb-2">Add skills, technologies, or areas of focus.</p>
                                <div className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-indigo-500 transition-all">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.expertise?.map((tag, i) => (
                                            <span key={i} className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded text-sm flex items-center">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-white"><X size={14}/></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-none text-white focus:ring-0 text-sm px-0 py-1"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={addTag}
                                        placeholder="Type skill and press Enter..."
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <h4 className="text-sm font-bold text-slate-400 mb-3">Suggested Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'Design', 'Strategy', 'UI/UX', 'Node.js', 'Branding', 'Motion'].map(tag => (
                                        <button 
                                            key={tag}
                                            type="button"
                                            onClick={() => !formData.expertise?.includes(tag) && setFormData(prev => ({...prev, expertise: [...(prev.expertise || []), tag]}))}
                                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full text-xs border border-slate-700 transition-colors"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SOCIAL TAB */}
                    {activeTab === 'SOCIAL' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">LinkedIn Profile</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.linkedinUrl}
                                        onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Twitter / X</label>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.twitterUrl}
                                        onChange={e => setFormData({...formData, twitterUrl: e.target.value})}
                                        placeholder="https://x.com/..."
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800 space-y-4">
                                <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                    <div>
                                        <div className="text-white font-medium">Featured Member</div>
                                        <div className="text-xs text-slate-400">Show on the home page or top of list.</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={formData.featured}
                                            onChange={e => setFormData({...formData, featured: e.target.checked})}
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Display Order</label>
                                    <input 
                                        type="number" 
                                        className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.displayOrder}
                                        onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                                    />
                                    <p className="text-xs text-slate-500">Lower numbers appear first.</p>
                                </div>
                            </div>
                        </div>
                    )}
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
           <h1 className="text-2xl font-bold text-white">Team Management</h1>
           <p className="text-slate-400 mt-1">Manage employees, roles, and profiles.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={20} className="mr-2" /> Add Member
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search by name or role..." 
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
                value={filterFeatured === 'ALL' ? 'ALL' : filterFeatured.toString()}
                onChange={(e) => setFilterFeatured(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
                className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
                <option value="ALL">All Members</option>
                <option value="true">Featured Only</option>
                <option value="false">Standard Only</option>
            </select>
        </div>
      </div>

      {/* Team Grid/Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Member</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Division</th>
                        <th className="px-6 py-4 font-semibold">Featured</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading team...</td></tr>
                    ) : filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <img src={member.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover border border-slate-700 mr-4" />
                                    <div>
                                        <div className="font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleView(member)}>
                                            {member.name}
                                        </div>
                                        <div className="text-xs text-slate-500">{member.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300">
                                {member.role}
                            </td>
                            <td className="px-6 py-4">
                                <DivisionBadge division={member.division} />
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleToggleFeatured(member)} className="focus:outline-none">
                                    {member.featured ? (
                                        <Star size={18} className="text-yellow-500 fill-yellow-500 hover:text-yellow-400" />
                                    ) : (
                                        <Star size={18} className="text-slate-700 hover:text-slate-500" />
                                    )}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={() => handleView(member)}
                                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Layout size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(member)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!loading && filteredMembers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No members found matching your filters.
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

export default TeamManager;