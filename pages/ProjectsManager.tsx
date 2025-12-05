
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Sparkles, Image as ImageIcon, 
  X, Save, Trash2, Globe, Video, List, Layout, Tag, ArrowLeft, Upload
} from 'lucide-react';
import { getProjects, createProject, deleteProject } from '../services/apiService';
import { generateProjectDescription } from '../services/geminiService';
import { Project, Division } from '../types';

const ProjectsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM'>('LIST');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const initialFormState: Partial<Project> = {
    title: '',
    client: '',
    division: 'TECH',
    tags: [],
    description: '',
    fullDescription: '',
    imageUrl: '',
    additionalImages: [],
    videoUrl: '',
    technologies: [],
    results: [],
    slug: '',
    metaTitle: '',
    metaDescription: '',
    featured: false
  };

  const [formData, setFormData] = useState<Partial<Project>>(initialFormState);
  
  // Input specific states
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'BASIC' | 'MEDIA' | 'DETAILS' | 'SEO'>('BASIC');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  // Helper: Auto-generate slug
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.client) {
        alert("Please enter a Title and Client Name first.");
        return;
    }
    setIsGeneratingAI(true);
    const desc = await generateProjectDescription(
        formData.title!, 
        formData.client!, 
        [...(formData.tags || []), ...(formData.technologies || [])]
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.division) return;
    
    // Simulate image if empty
    const payload = {
        ...formData,
        imageUrl: formData.imageUrl || `https://picsum.photos/400/300?random=${Math.floor(Math.random()*100)}`,
        tags: formData.tags || [],
        technologies: formData.technologies || [],
        results: formData.results || [],
        additionalImages: formData.additionalImages || [],
    } as Omit<Project, 'id' | 'createdAt'>;

    await createProject(payload);
    await fetchProjects();
    setViewMode('LIST');
    setFormData(initialFormState);
    setActiveTab('BASIC');
  };

  const handleDelete = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this project?')) {
          await deleteProject(id);
          fetchProjects();
      }
  }

  // Array Managers
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
        e.preventDefault();
        setFormData(prev => ({...prev, tags: [...(prev.tags || []), tagInput]}));
        setTagInput('');
    }
  }
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({...prev, tags: prev.tags?.filter(t => t !== tagToRemove)}));
  }

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput) {
        e.preventDefault();
        setFormData(prev => ({...prev, technologies: [...(prev.technologies || []), techInput]}));
        setTechInput('');
    }
  }
  const removeTech = (techToRemove: string) => {
    setFormData(prev => ({...prev, technologies: prev.technologies?.filter(t => t !== techToRemove)}));
  }

  const addResult = () => {
    if (resultInput) {
        setFormData(prev => ({...prev, results: [...(prev.results || []), resultInput]}));
        setResultInput('');
    }
  }
  const removeResult = (index: number) => {
    setFormData(prev => ({...prev, results: prev.results?.filter((_, i) => i !== index)}));
  }

  const addImage = () => {
    if (imageInput) {
        setFormData(prev => ({...prev, additionalImages: [...(prev.additionalImages || []), imageInput]}));
        setImageInput('');
    }
  }
  const removeImage = (index: number) => {
    setFormData(prev => ({...prev, additionalImages: prev.additionalImages?.filter((_, i) => i !== index)}));
  }

  // Form Components
  if (viewMode === 'FORM') {
    return (
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
            <div className="flex items-center">
                <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-white">
                    {formData.title ? `Editing: ${formData.title}` : 'Create New Project'}
                </h2>
            </div>
            <div className="flex space-x-2">
                 <button 
                    type="button"
                    onClick={() => setViewMode('LIST')}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-transparent hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} className="mr-2" />
                    Save Project
                </button>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            {[
                { id: 'BASIC', label: 'Basic Info', icon: <Layout size={16} /> },
                { id: 'MEDIA', label: 'Media', icon: <ImageIcon size={16} /> },
                { id: 'DETAILS', label: 'Details', icon: <List size={16} /> },
                { id: 'SEO', label: 'SEO', icon: <Globe size={16} /> },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeTab === tab.id 
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
                
                {/* BASIC INFO TAB */}
                {activeTab === 'BASIC' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Project Title <span className="text-red-400">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Neon Fintech Dashboard"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Client Name <span className="text-red-400">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    value={formData.client}
                                    onChange={e => setFormData({...formData, client: e.target.value})}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Division <span className="text-red-400">*</span></label>
                                <select 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.division}
                                    onChange={e => setFormData({...formData, division: e.target.value as Division})}
                                >
                                    <option value="TECH">TECH</option>
                                    <option value="STUDIO">STUDIO</option>
                                    <option value="BRAND">BRAND</option>
                                </select>
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Project Tags <span className="text-red-400">*</span></label>
                                <div className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                                    <div className="flex flex-wrap gap-2 mb-1">
                                        {formData.tags?.map((tag, i) => (
                                            <span key={i} className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded text-xs flex items-center">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-white"><X size={12}/></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full bg-transparent border-none text-white focus:ring-0 text-sm px-2 py-1"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={addTag}
                                        placeholder="Type and press Enter to add tags..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-300">Short Description <span className="text-red-400">*</span></label>
                                <button 
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={isGeneratingAI}
                                    className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                >
                                    {isGeneratingAI ? <span className="animate-pulse">Generating...</span> : <><Sparkles size={12} className="mr-1" /> Generate with AI</>}
                                </button>
                            </div>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-24 focus:border-indigo-500 focus:outline-none transition-all resize-none"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief overview of the project (max 500 chars)..."
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-slate-500">{formData.description?.length}/500</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Description (Rich Text)</label>
                            <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 focus-within:border-indigo-500 transition-all">
                                <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex gap-2">
                                    {['B', 'I', 'U', 'H1', 'H2', 'List'].map(tool => (
                                        <button key={tool} type="button" className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 hover:bg-slate-800 rounded">
                                            {tool}
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    className="w-full bg-slate-950 border-none px-4 py-2.5 text-white h-48 focus:ring-0 resize-y"
                                    value={formData.fullDescription}
                                    onChange={e => setFormData({...formData, fullDescription: e.target.value})}
                                    placeholder="Detailed case study content..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* MEDIA TAB */}
                {activeTab === 'MEDIA' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-slate-300 block">Main Featured Image <span className="text-red-400">*</span></label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <button type="button" className="bg-slate-800 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white">
                                            <Upload size={18} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500">Recommended size: 1920x1080px. Max 5MB.</p>
                                </div>
                                <div className="w-40 h-24 bg-slate-950 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-slate-600 flex flex-col items-center">
                                            <ImageIcon size={24} className="mb-1"/>
                                            <span className="text-xs">No Preview</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-800">
                            <label className="text-sm font-medium text-slate-300 block">Video URL (Optional)</label>
                            <div className="relative">
                                <Video className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.videoUrl}
                                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-800">
                            <label className="text-sm font-medium text-slate-300 block">Image Gallery</label>
                            <div className="flex gap-2 mb-4">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                    value={imageInput}
                                    onChange={e => setImageInput(e.target.value)}
                                    placeholder="Add image URL..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                />
                                <button 
                                    type="button" 
                                    onClick={addImage}
                                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                                >
                                    Add
                                </button>
                            </div>
                            
                            {/* Gallery Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.additionalImages?.map((img, i) => (
                                    <div key={i} className="group relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button" 
                                                onClick={() => removeImage(i)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.additionalImages || formData.additionalImages.length === 0) && (
                                    <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-slate-700 rounded-lg">
                                        No additional images added.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* DETAILS TAB */}
                {activeTab === 'DETAILS' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Technologies Used</label>
                            <div className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 focus-within:border-indigo-500 transition-all">
                                <div className="flex flex-wrap gap-2 mb-1">
                                    {formData.technologies?.map((tech, i) => (
                                        <span key={i} className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded text-xs flex items-center">
                                            {tech}
                                            <button type="button" onClick={() => removeTech(tech)} className="ml-1 hover:text-white"><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    type="text" 
                                    className="w-full bg-transparent border-none text-white focus:ring-0 text-sm px-2 py-1"
                                    value={techInput}
                                    onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={addTech}
                                    placeholder="e.g. React Native, Node.js..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-800">
                             <label className="text-sm font-medium text-slate-300 block">Results & Outcomes</label>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                    value={resultInput}
                                    onChange={e => setResultInput(e.target.value)}
                                    placeholder="e.g. Increased conversion by 150%..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResult())}
                                />
                                <button 
                                    type="button" 
                                    onClick={addResult}
                                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {formData.results?.map((res, i) => (
                                    <li key={i} className="flex items-center justify-between bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                                        <span className="text-slate-300 text-sm">{res}</span>
                                        <button type="button" onClick={() => removeResult(i)} className="text-slate-500 hover:text-red-400">
                                            <X size={16} />
                                        </button>
                                    </li>
                                ))}
                                {(!formData.results || formData.results.length === 0) && (
                                    <li className="text-sm text-slate-500 italic">No results added yet.</li>
                                )}
                            </ul>
                        </div>

                         <div className="space-y-4 pt-6 border-t border-slate-800">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.featured ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.featured ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={formData.featured}
                                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                                />
                                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Mark as Featured Project</span>
                            </label>
                         </div>
                    </div>
                )}

                {/* SEO TAB */}
                {activeTab === 'SEO' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-6">
                            <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center">
                                <Globe size={14} className="mr-2" /> Search Preview
                            </h4>
                            <div className="font-sans">
                                <div className="text-[#8ab4f8] text-xl truncate hover:underline cursor-pointer">
                                    {formData.metaTitle || formData.title || 'Project Title'} | Aureus Digital
                                </div>
                                <div className="text-[#202124] dark:text-[#bdc1c6] text-sm">
                                    https://aureus.agency/projects/{formData.slug || 'project-slug'}
                                </div>
                                <div className="text-[#bdc1c6] text-sm mt-1 line-clamp-2">
                                    {formData.metaDescription || formData.description || 'Project description...'}
                                </div>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">URL Slug</label>
                            <div className="flex items-center">
                                <span className="text-slate-500 bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg px-3 py-2.5 text-sm">
                                    /projects/
                                </span>
                                <input 
                                    type="text" 
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-r-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.slug}
                                    onChange={e => setFormData({...formData, slug: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Meta Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.metaTitle}
                                onChange={e => setFormData({...formData, metaTitle: e.target.value})}
                                placeholder="SEO optimized title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Meta Description</label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-24 focus:border-indigo-500 focus:outline-none resize-none"
                                value={formData.metaDescription}
                                onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                                placeholder="SEO optimized description (150-160 characters)"
                            />
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
           <h1 className="text-2xl font-bold text-white">Projects</h1>
           <p className="text-slate-400 mt-1">Manage your portfolio and case studies.</p>
        </div>
        <button 
          onClick={() => setViewMode('FORM')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={20} className="mr-2" /> New Project
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search projects by title, client or tag..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">
            <Filter size={18} className="mr-2" /> Filter
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
          <div className="text-center py-20 text-slate-500">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-colors flex flex-col h-full">
                    <div className="relative h-48 bg-slate-800 overflow-hidden">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                             {project.featured && (
                                <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-500/80 text-white backdrop-blur-md flex items-center">
                                    <Sparkles size={10} className="mr-1" /> Feat.
                                </span>
                            )}
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-black/50 backdrop-blur-md
                                ${project.division === 'TECH' ? 'text-cyan-400' : 
                                  project.division === 'STUDIO' ? 'text-fuchsia-400' : 'text-indigo-400'}`}>
                                {project.division}
                            </span>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-white text-lg truncate pr-2" title={project.title}>{project.title}</h3>
                                <p className="text-sm text-slate-400">{project.client}</p>
                            </div>
                            <div className="flex space-x-1">
                                <button className="text-slate-500 hover:text-white p-1">
                                    <Layout size={16} />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="text-slate-500 hover:text-red-400 p-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                            {project.description}
                        </p>
                        <div className="mt-auto pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="flex items-center text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md">
                                    <Tag size={10} className="mr-1 opacity-50" /> {tag}
                                </span>
                            ))}
                            {project.tags.length > 3 && (
                                <span className="text-xs text-slate-500 px-1 py-1">+{project.tags.length - 3}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
