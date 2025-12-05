import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Check, CreditCard, 
  ArrowLeft, Save, Star, Zap, Layout, X, MoveUp, MoveDown
} from 'lucide-react';
import { getPricingPackages, createPricingPackage, updatePricingPackage, deletePricingPackage } from '../services/apiService';
import { PricingPackage, Division } from '../types';

const PricingManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Form State
  const initialFormState: Partial<PricingPackage> = {
    title: '',
    division: 'TECH',
    price: '',
    priceNote: '',
    description: '',
    features: [],
    isPopular: false,
    isHighlight: false,
    deliveryTime: '',
    revisions: ''
  };

  const [formData, setFormData] = useState<Partial<PricingPackage>>(initialFormState);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const data = await getPricingPackages();
    setPackages(data);
    setLoading(false);
  };

  // --- FILTERING LOGIC ---
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'ALL' || pkg.division === filterDivision;
    const matchesType = filterType === 'ALL' || 
                        (filterType === 'POPULAR' && pkg.isPopular) || 
                        (filterType === 'HIGHLIGHT' && pkg.isHighlight);
    return matchesSearch && matchesDivision && matchesType;
  }).sort((a, b) => {
      // Sort by Division then Price (lexicographical sort on string price isn't perfect but sufficient for now)
      if (a.division !== b.division) return a.division.localeCompare(b.division);
      return a.title.localeCompare(b.title);
  });

  // --- HANDLERS ---
  const handleCreateNew = () => {
    setFormData(initialFormState);
    setViewMode('FORM');
  };

  const handleEdit = (pkg: PricingPackage) => {
    setFormData({ ...pkg });
    setViewMode('FORM');
  };

  const handleView = (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    setViewMode('DETAIL');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pricing package?')) {
      await deletePricingPackage(id);
      fetchPackages();
      if (viewMode === 'DETAIL') setViewMode('LIST');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.id) {
        await updatePricingPackage(formData.id, formData);
    } else {
        await createPricingPackage(formData as Omit<PricingPackage, 'id'>);
    }

    await fetchPackages();
    setViewMode('LIST');
  };

  // Feature List Managers
  const addFeature = () => {
    if (featureInput) {
        setFormData(prev => ({...prev, features: [...(prev.features || []), featureInput]}));
        setFeatureInput('');
    }
  };
  
  const removeFeature = (index: number) => {
    setFormData(prev => ({...prev, features: prev.features?.filter((_, i) => i !== index)}));
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
      if (!formData.features) return;
      const newFeatures = [...formData.features];
      if (direction === 'up' && index > 0) {
          [newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]];
      } else if (direction === 'down' && index < newFeatures.length - 1) {
          [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]];
      }
      setFormData(prev => ({...prev, features: newFeatures}));
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

  if (viewMode === 'DETAIL' && selectedPackage) {
      return (
        <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            {/* Detail Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setViewMode('LIST')} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Packages
                </button>
                <div className="flex gap-2">
                     <button 
                        onClick={() => handleDelete(selectedPackage.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium border border-red-500/20"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => handleEdit(selectedPackage)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Edit Package
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Preview Card */}
                <div className="md:col-span-1">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Card Preview</h3>
                    <div className={`relative bg-slate-900 rounded-2xl p-6 border transition-transform
                        ${selectedPackage.isHighlight ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' : 'border-slate-800'}
                    `}>
                        {selectedPackage.isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                MOST POPULAR
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <DivisionBadge division={selectedPackage.division} />
                            {selectedPackage.isHighlight && <Zap size={16} className="text-indigo-400" />}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{selectedPackage.title}</h3>
                        <div className="mb-4">
                            <span className="text-3xl font-bold text-white">{selectedPackage.price}</span>
                            {selectedPackage.priceNote && <span className="text-slate-500 text-sm ml-2">{selectedPackage.priceNote}</span>}
                        </div>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            {selectedPackage.description}
                        </p>
                        <ul className="space-y-3 mb-8">
                            {selectedPackage.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-300">
                                    <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg font-bold text-sm bg-white text-slate-900 hover:bg-slate-200 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Info & Stats */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Package Details</h3>
                        <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
                                <div className="text-slate-200 font-medium">{selectedPackage.title}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Division</label>
                                <DivisionBadge division={selectedPackage.division} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Price</label>
                                <div className="text-slate-200">{selectedPackage.price} <span className="text-slate-500 text-sm">({selectedPackage.priceNote})</span></div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Feature Count</label>
                                <div className="text-slate-200">{selectedPackage.features.length} Items</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Delivery Time</label>
                                <div className="text-slate-200">{selectedPackage.deliveryTime || 'Not specified'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Revisions</label>
                                <div className="text-slate-200">{selectedPackage.revisions || 'Not specified'}</div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-800">
                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Description</label>
                             <p className="text-slate-300 leading-relaxed">{selectedPackage.description}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                         <h3 className="text-lg font-bold text-white mb-4">Configuration</h3>
                         <div className="flex space-x-8">
                             <div className="flex items-center">
                                 <div className={`w-3 h-3 rounded-full mr-2 ${selectedPackage.isPopular ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                 <span className="text-slate-300">Popular Badge</span>
                             </div>
                             <div className="flex items-center">
                                 <div className={`w-3 h-3 rounded-full mr-2 ${selectedPackage.isHighlight ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                 <span className="text-slate-300">Highlight Design</span>
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
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-10">
                <div className="flex items-center">
                    <button onClick={() => setViewMode('LIST')} className="mr-4 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-white">
                        {formData.id ? 'Edit Package' : 'Create Pricing Package'}
                    </h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} className="mr-2" />
                    Save Package
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
                    
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Package Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Package Title <span className="text-red-400">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Pro Plan"
                                />
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Price <span className="text-red-400">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    placeholder="e.g. 5,000€"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Price Note</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.priceNote}
                                    onChange={e => setFormData({...formData, priceNote: e.target.value})}
                                    placeholder="e.g. per month / one-time"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-24 focus:border-indigo-500 focus:outline-none resize-none"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Short description of what's included..."
                            />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Features List</h3>
                        
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                value={featureInput}
                                onChange={e => setFeatureInput(e.target.value)}
                                placeholder="Add a feature..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <button 
                                type="button" 
                                onClick={addFeature}
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                            >
                                Add
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.features?.map((feature, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50 group">
                                    <div className="flex items-center text-slate-300">
                                        <div className="flex flex-col mr-3 space-y-1">
                                            <button type="button" onClick={() => moveFeature(i, 'up')} className="text-slate-600 hover:text-white disabled:opacity-30" disabled={i===0}><MoveUp size={12}/></button>
                                            <button type="button" onClick={() => moveFeature(i, 'down')} className="text-slate-600 hover:text-white disabled:opacity-30" disabled={i === (formData.features?.length || 0) - 1}><MoveDown size={12}/></button>
                                        </div>
                                        {feature}
                                    </div>
                                    <button type="button" onClick={() => removeFeature(i)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!formData.features || formData.features.length === 0) && (
                                <div className="text-center py-6 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                                    No features added yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">Display & Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Estimated Delivery</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.deliveryTime}
                                    onChange={e => setFormData({...formData, deliveryTime: e.target.value})}
                                    placeholder="e.g. 2 weeks"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Revisions</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                    value={formData.revisions}
                                    onChange={e => setFormData({...formData, revisions: e.target.value})}
                                    placeholder="e.g. Unlimited"
                                />
                            </div>
                        </div>

                        <div className="flex gap-8 pt-2">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isPopular ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isPopular ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={formData.isPopular}
                                    onChange={e => setFormData({...formData, isPopular: e.target.checked})}
                                />
                                <span className="text-slate-300 font-medium group-hover:text-white transition-colors flex items-center">
                                    <Star size={14} className="mr-1.5" /> Mark as Popular
                                </span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isHighlight ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isHighlight ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={formData.isHighlight}
                                    onChange={e => setFormData({...formData, isHighlight: e.target.checked})}
                                />
                                <span className="text-slate-300 font-medium group-hover:text-white transition-colors flex items-center">
                                    <Zap size={14} className="mr-1.5" /> Highlight Style
                                </span>
                            </label>
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
                <h1 className="text-2xl font-bold text-white">Pricing Packages</h1>
                <p className="text-slate-400 mt-1">Manage service offerings and pricing tiers.</p>
            </div>
            <button 
                onClick={handleCreateNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Plus size={20} className="mr-2" /> Add Package
            </button>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by title..." 
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
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                    <option value="ALL">All Types</option>
                    <option value="POPULAR">Popular Only</option>
                    <option value="HIGHLIGHT">Highlighted Only</option>
                </select>
            </div>
        </div>

        {/* List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Title</th>
                            <th className="px-6 py-4 font-semibold">Division</th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold">Features</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading packages...</td></tr>
                        ) : filteredPackages.map((pkg) => (
                            <tr key={pkg.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleView(pkg)}>
                                        {pkg.title}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{pkg.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <DivisionBadge division={pkg.division} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-200 font-medium">{pkg.price}</div>
                                    <div className="text-xs text-slate-500">{pkg.priceNote}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {pkg.features.length} features
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-1">
                                        {pkg.isPopular && <span title="Popular" className="p-1 bg-green-500/10 text-green-500 rounded"><Star size={14} className="fill-current"/></span>}
                                        {pkg.isHighlight && <span title="Highlighted" className="p-1 bg-yellow-500/10 text-yellow-500 rounded"><Zap size={14} className="fill-current"/></span>}
                                        {!pkg.isPopular && !pkg.isHighlight && <span className="text-slate-600 text-xs">-</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleView(pkg)}
                                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Layout size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(pkg)}
                                            className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredPackages.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No pricing packages found.
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

export default PricingManager;