import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Layout, Globe, 
  Calendar, Clock, User, CheckCircle, XCircle, ArrowLeft,
  Image as ImageIcon, Save, X, Type, Tag
} from 'lucide-react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../services/apiService';
import { BlogPost } from '../types';

const BlogManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Form State
  const initialFormState: Partial<BlogPost> = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Insights',
    imageUrl: '',
    status: 'DRAFT',
    publishedDate: new Date().toISOString().split('T')[0],
    readingTime: '5 min',
    featured: false,
    author: 'Admin',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: []
  };

  const [formData, setFormData] = useState<Partial<BlogPost>>(initialFormState);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'PUBLISHING' | 'SEO'>('CONTENT');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  // --- HANDLERS ---

  const handleCreateNew = () => {
    setFormData(initialFormState);
    setViewMode('FORM');
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({ ...post });
    setViewMode('FORM');
  };

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setViewMode('DETAIL');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteBlogPost(id);
      fetchPosts();
      if (viewMode === 'DETAIL') setViewMode('LIST');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await updateBlogPost(post.id, { status: newStatus });
    fetchPosts();
  };

  // Auto-generate slug
  useEffect(() => {
    if (formData.title && viewMode === 'FORM' && !formData.id) { // Only auto-gen for new posts
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Auto-calculate reading time
  useEffect(() => {
    if (formData.content) {
        const words = formData.content.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200); // Avg reading speed 200 wpm
        setFormData(prev => ({ ...prev, readingTime: `${time} min` }));
    }
  }, [formData.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback image
    const payload = {
        ...formData,
        imageUrl: formData.imageUrl || `https://picsum.photos/400/300?random=${Math.floor(Math.random()*100)}`,
        tags: formData.tags || [],
    };

    if (formData.id) {
        await updateBlogPost(formData.id, payload);
    } else {
        await createBlogPost(payload as Omit<BlogPost, 'id'>);
    }

    await fetchPosts();
    setViewMode('LIST');
  };

  // Tag Helpers
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
        e.preventDefault();
        setFormData(prev => ({...prev, tags: [...(prev.tags || []), tagInput]}));
        setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    setFormData(prev => ({...prev, tags: prev.tags?.filter(t => t !== tag)}));
  };

  // --- RENDERERS ---

  if (viewMode === 'DETAIL' && selectedPost) {
    return (
        <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Blog
                </button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleDelete(selectedPost.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium border border-red-500/20"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => handleTogglePublish(selectedPost)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center
                        ${selectedPost.status === 'PUBLISHED' 
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' 
                            : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'}`}
                    >
                        {selectedPost.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                        onClick={() => handleEdit(selectedPost)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Edit Post
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Meta Header */}
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center gap-2">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">
                                {selectedPost.category}
                            </span>
                            {selectedPost.status === 'DRAFT' && (
                                <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-bold">
                                    DRAFT
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            {selectedPost.title}
                        </h1>
                        <div className="flex items-center justify-center text-slate-400 text-sm gap-4">
                            <span className="flex items-center"><User size={14} className="mr-1"/> {selectedPost.author}</span>
                            <span className="flex items-center"><Calendar size={14} className="mr-1"/> {selectedPost.publishedDate}</span>
                            <span className="flex items-center"><Clock size={14} className="mr-1"/> {selectedPost.readingTime}</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-video w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                        <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                         {/* Simulating Rich Text Output */}
                         {selectedPost.content.split('\n').map((para, i) => (
                             <p key={i}>{para}</p>
                         ))}
                    </div>

                    {/* Footer Tags */}
                    <div className="pt-8 border-t border-slate-800">
                         <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase">Tags</h4>
                         <div className="flex flex-wrap gap-2">
                            {selectedPost.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-md text-sm">
                                    #{tag}
                                </span>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (viewMode === 'FORM') {
      return (
        <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            {/* Form Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-white">
                        {formData.id ? `Edit Post: ${formData.title}` : 'Create New Blog Post'}
                    </h2>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={handleSubmit} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Save size={18} className="mr-2" />
                        Save Post
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                {[
                    { id: 'CONTENT', label: 'Content', icon: <Type size={16} /> },
                    { id: 'PUBLISHING', label: 'Publishing', icon: <Calendar size={16} /> },
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

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
                    
                    {/* CONTENT TAB */}
                    {activeTab === 'CONTENT' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Post Title <span className="text-red-400">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        placeholder="Enter catchy title..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Category <span className="text-red-400">*</span></label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="Insights">Insights</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Branding">Branding</option>
                                        <option value="Company News">Company News</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Excerpt <span className="text-red-400">*</span></label>
                                <textarea 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-24 focus:border-indigo-500 focus:outline-none resize-none"
                                    value={formData.excerpt}
                                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                    placeholder="Short summary for list views..."
                                    maxLength={200}
                                />
                                <div className="text-right text-xs text-slate-500">{formData.excerpt?.length}/200</div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Featured Image URL</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                        placeholder="https://..."
                                    />
                                    <div className="w-16 h-11 bg-slate-800 rounded border border-slate-700 flex items-center justify-center overflow-hidden">
                                        {formData.imageUrl ? (
                                            <img src={formData.imageUrl} alt="Prev" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={16} className="text-slate-500"/>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Post Content (Rich Text)</label>
                                <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 focus-within:border-indigo-500 transition-all">
                                    {/* Mock Toolbar */}
                                    <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex gap-2 overflow-x-auto">
                                        {['B', 'I', 'U', 'H1', 'H2', 'Quote', 'Link', 'Image'].map(tool => (
                                            <button key={tool} type="button" className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 hover:bg-slate-800 rounded whitespace-nowrap">
                                                {tool}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        className="w-full bg-slate-950 border-none px-4 py-4 text-white h-[400px] focus:ring-0 resize-y font-mono text-sm leading-relaxed"
                                        value={formData.content}
                                        onChange={e => setFormData({...formData, content: e.target.value})}
                                        placeholder="Write your article here using Markdown..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Tags</label>
                                <div className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 focus-within:border-indigo-500 transition-all">
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
                    )}

                    {/* PUBLISHING TAB */}
                    {activeTab === 'PUBLISHING' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Publish Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.publishedDate}
                                        onChange={e => setFormData({...formData, publishedDate: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Status</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Author</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                        value={formData.author}
                                        onChange={e => setFormData({...formData, author: e.target.value})}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Sarah Jenkins">Sarah Jenkins</option>
                                        <option value="Mike Chen">Mike Chen</option>
                                        <option value="Emma Wilson">Emma Wilson</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Reading Time (Calculated)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-400 focus:outline-none cursor-not-allowed"
                                        value={formData.readingTime}
                                        readOnly
                                    />
                                </div>
                            </div>

                             <div className="space-y-4 pt-4 border-t border-slate-800">
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
                                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Featured Post</span>
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
                                        {formData.metaTitle || formData.title || 'Post Title'} | Aureus Blog
                                    </div>
                                    <div className="text-[#202124] dark:text-[#bdc1c6] text-sm">
                                        https://aureus.agency/blog/{formData.slug || 'post-slug'}
                                    </div>
                                    <div className="text-[#bdc1c6] text-sm mt-1 line-clamp-2">
                                        {formData.metaDescription || formData.excerpt || 'Post description...'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Slug URL</label>
                                <div className="flex items-center">
                                    <span className="text-slate-500 bg-slate-800 border border-r-0 border-slate-700 rounded-l-lg px-3 py-2.5 text-sm">
                                        /blog/
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
                                    placeholder="SEO Title (leave empty to use Post Title)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Meta Description</label>
                                <textarea 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-24 focus:border-indigo-500 focus:outline-none resize-none"
                                    value={formData.metaDescription}
                                    onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                                    placeholder="SEO Description (150-160 chars)"
                                />
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
           <p className="text-slate-400 mt-1">Manage articles, news, and insights.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={20} className="mr-2" /> New Post
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search by title, category or author..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">
            <Filter size={18} className="mr-2" /> Filter
        </button>
      </div>

      {/* Blog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Post</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading posts...</td></tr>
                    ) : posts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-16 bg-slate-800 rounded flex-shrink-0 overflow-hidden mr-4 border border-slate-700">
                                        {post.imageUrl ? (
                                            <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={16}/></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm cursor-pointer hover:text-indigo-400" onClick={() => handleView(post)}>
                                            {post.title}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                            {post.readingTime} read • {post.author}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {post.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">
                                {post.publishedDate}
                            </td>
                            <td className="px-6 py-4">
                                {post.status === 'PUBLISHED' ? (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-green-400 bg-green-500/10 rounded-full">
                                        <CheckCircle size={10} className="mr-1" /> Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-slate-400 bg-slate-700 rounded-full">
                                        <Clock size={10} className="mr-1" /> Draft
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleView(post)}
                                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="View"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(post)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleTogglePublish(post)}
                                        className={`p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors
                                            ${post.status === 'PUBLISHED' ? 'text-green-400 hover:text-yellow-400' : 'text-slate-400 hover:text-green-400'}`}
                                        title={post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!loading && posts.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No blog posts found.
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

export default BlogManager;