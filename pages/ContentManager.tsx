import React, { useState, useEffect } from 'react';
import { 
  Save, RefreshCw, LayoutTemplate, Layers, MousePointer, 
  Cpu, Award, Users, FileText, Plus, Trash2, MoveUp, MoveDown,
  ChevronRight, Calendar, Trophy, Rocket, Heart, Zap, Monitor, TrendingUp, PenTool, Code, Search, Map
} from 'lucide-react';
import { getHomePageContent, updateHomePageContent } from '../services/apiService';
import { HomePageContent, MetricItem, MethodologyStep, WhyUsItem } from '../types';

// Simplified Icon Mapping for Preview
const IconMap: Record<string, React.ElementType> = {
    Calendar, Trophy, Rocket, Heart, Zap, Monitor, TrendingUp, PenTool, Code, Search, Map
};

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'HERO' | 'METRICS' | 'METHOD' | 'TECH' | 'WHY' | 'TEAM' | 'BLOG'>('HERO');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const data = await getHomePageContent();
    setContent(data);
    setLoading(false);
  };

  const handleSave = async () => {
      if (!content) return;
      setSaving(true);
      await updateHomePageContent(content);
      setSaving(false);
      alert('Content updated successfully!');
  };

  const handleRevert = () => {
      if(window.confirm("Discard unsaved changes and revert to last saved version?")) {
          fetchContent();
      }
  };

  // --- ARRAY MANAGERS ---
  const addMetric = () => {
      if (!content) return;
      const newItem: MetricItem = {
          id: Math.random().toString(36).substr(2, 5),
          value: '0',
          label: 'New Metric',
          icon: 'Trophy',
          color: 'indigo',
          order: content.metrics.length + 1
      };
      setContent({...content, metrics: [...content.metrics, newItem]});
  };

  const updateMetric = (index: number, field: keyof MetricItem, value: any) => {
      if (!content) return;
      const newMetrics = [...content.metrics];
      newMetrics[index] = { ...newMetrics[index], [field]: value };
      setContent({...content, metrics: newMetrics});
  };

  const removeMetric = (index: number) => {
      if (!content) return;
      const newMetrics = content.metrics.filter((_, i) => i !== index);
      setContent({...content, metrics: newMetrics});
  };

  const addStep = () => {
      if (!content) return;
      const newItem: MethodologyStep = {
          id: Math.random().toString(36).substr(2, 5),
          stepNumber: `0${content.methodology.steps.length + 1}`,
          title: 'New Step',
          description: 'Step description',
          icon: 'Circle',
          order: content.methodology.steps.length + 1
      };
      setContent({...content, methodology: { ...content.methodology, steps: [...content.methodology.steps, newItem] }});
  };

  const updateStep = (index: number, field: keyof MethodologyStep, value: any) => {
      if (!content) return;
      const newSteps = [...content.methodology.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      setContent({...content, methodology: { ...content.methodology, steps: newSteps }});
  };

  const removeStep = (index: number) => {
      if (!content) return;
      const newSteps = content.methodology.steps.filter((_, i) => i !== index);
      setContent({...content, methodology: { ...content.methodology, steps: newSteps }});
  };
  
  const addWhyUs = () => {
      if (!content) return;
      const newItem: WhyUsItem = {
          id: Math.random().toString(36).substr(2, 5),
          title: 'New Reason',
          description: 'Reason description',
          icon: 'Check',
          color: 'indigo'
      };
      setContent({...content, whyUs: { ...content.whyUs, items: [...content.whyUs.items, newItem] }});
  };

   const updateWhyUs = (index: number, field: keyof WhyUsItem, value: any) => {
      if (!content) return;
      const newItems = [...content.whyUs.items];
      newItems[index] = { ...newItems[index], [field]: value };
      setContent({...content, whyUs: { ...content.whyUs, items: newItems }});
  };

  const removeWhyUs = (index: number) => {
      if (!content) return;
      const newItems = content.whyUs.items.filter((_, i) => i !== index);
      setContent({...content, whyUs: { ...content.whyUs, items: newItems }});
  };

  const handleTechChange = (type: 'techItems' | 'creativeItems', val: string) => {
      if (!content) return;
      // Split by comma
      const items = val.split(',').map(s => s.trim()).filter(s => s !== '');
      setContent({...content, techStack: { ...content.techStack, [type]: items }});
  };

  if (loading) return <div className="text-white p-8">Loading content...</div>;
  if (!content) return <div className="text-white p-8">Error loading content.</div>;

  const renderIcon = (name: string, className?: string) => {
      const Icon = IconMap[name] || Zap; // Default icon
      return <Icon className={className} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h1 className="text-2xl font-bold text-white">Home Page Content</h1>
           <p className="text-slate-400 mt-1">Manage content sections for the main landing page.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleRevert}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center transition-colors border border-slate-700"
            >
                <RefreshCw size={18} className="mr-2" /> Revert
            </button>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
                {saving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Changes</>}
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden border border-slate-800 rounded-xl bg-slate-900">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
               <button 
                  onClick={() => setActiveTab('HERO')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'HERO' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <LayoutTemplate size={16} className="mr-3" /> Hero Section
               </button>
               <button 
                  onClick={() => setActiveTab('METRICS')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'METRICS' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <Layers size={16} className="mr-3" /> Metrics
               </button>
               <button 
                  onClick={() => setActiveTab('METHOD')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'METHOD' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <MousePointer size={16} className="mr-3" /> Methodology
               </button>
               <button 
                  onClick={() => setActiveTab('TECH')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'TECH' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <Cpu size={16} className="mr-3" /> Tech Stack
               </button>
               <button 
                  onClick={() => setActiveTab('WHY')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'WHY' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <Award size={16} className="mr-3" /> Why Us
               </button>
               <button 
                  onClick={() => setActiveTab('TEAM')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'TEAM' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <Users size={16} className="mr-3" /> Team Teaser
               </button>
                <button 
                  onClick={() => setActiveTab('BLOG')}
                  className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                  ${activeTab === 'BLOG' ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
               >
                   <FileText size={16} className="mr-3" /> Blog Section
               </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Side */}
              <div className="space-y-6">
                   <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">
                       Edit {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Content
                   </h2>

                   {activeTab === 'HERO' && (
                       <div className="space-y-4">
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Badge Text</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.hero.badgeText} onChange={e => setContent({...content, hero: {...content.hero, badgeText: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Title</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.hero.title} onChange={e => setContent({...content, hero: {...content.hero, title: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Subtitle</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.hero.subtitle} onChange={e => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Description</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" 
                                      value={content.hero.description} onChange={e => setContent({...content, hero: {...content.hero, description: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Highlight Text</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.hero.highlight} onChange={e => setContent({...content, hero: {...content.hero, highlight: e.target.value}})} />
                           </div>
                       </div>
                   )}

                   {activeTab === 'METRICS' && (
                       <div className="space-y-4">
                           {content.metrics.map((metric, idx) => (
                               <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 relative group">
                                    <button onClick={() => removeMetric(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400">Value</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={metric.value} onChange={e => updateMetric(idx, 'value', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400">Label</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={metric.label} onChange={e => updateMetric(idx, 'label', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400">Icon Name (Lucide)</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={metric.icon} onChange={e => updateMetric(idx, 'icon', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400">Color</label>
                                            <select className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={metric.color} onChange={e => updateMetric(idx, 'color', e.target.value)}>
                                                    <option value="indigo">Indigo</option>
                                                    <option value="yellow">Yellow</option>
                                                    <option value="cyan">Cyan</option>
                                                    <option value="rose">Rose</option>
                                                    <option value="emerald">Emerald</option>
                                            </select>
                                        </div>
                                    </div>
                               </div>
                           ))}
                           <button onClick={addMetric} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center">
                               <Plus size={16} className="mr-2"/> Add Metric
                           </button>
                       </div>
                   )}

                   {activeTab === 'METHOD' && (
                       <div className="space-y-6">
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Section Title</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.methodology.title} onChange={e => setContent({...content, methodology: {...content.methodology, title: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Section Description</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white h-20" 
                                      value={content.methodology.description} onChange={e => setContent({...content, methodology: {...content.methodology, description: e.target.value}})} />
                           </div>
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-4">Steps</h3>
                           {content.methodology.steps.map((step, idx) => (
                               <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 relative group">
                                    <button onClick={() => removeStep(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-xs text-slate-400">Step Title</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={step.title} onChange={e => updateStep(idx, 'title', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-slate-400">Description</label>
                                            <textarea className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm h-16" 
                                                value={step.description} onChange={e => updateStep(idx, 'description', e.target.value)} />
                                        </div>
                                         <div>
                                            <label className="text-xs text-slate-400">Step Number</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={step.stepNumber} onChange={e => updateStep(idx, 'stepNumber', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400">Icon</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={step.icon} onChange={e => updateStep(idx, 'icon', e.target.value)} />
                                        </div>
                                    </div>
                               </div>
                           ))}
                           <button onClick={addStep} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center">
                               <Plus size={16} className="mr-2"/> Add Step
                           </button>
                       </div>
                   )}

                    {activeTab === 'TECH' && (
                       <div className="space-y-6">
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Section Title</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.techStack.title} onChange={e => setContent({...content, techStack: {...content.techStack, title: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Technical Stack (Comma separated)</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 font-mono text-sm" 
                                      value={content.techStack.techItems.join(', ')} 
                                      onChange={e => handleTechChange('techItems', e.target.value)} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Creative Stack (Comma separated)</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white h-24 font-mono text-sm" 
                                      value={content.techStack.creativeItems.join(', ')} 
                                      onChange={e => handleTechChange('creativeItems', e.target.value)} />
                           </div>
                       </div>
                   )}

                   {activeTab === 'WHY' && (
                       <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Section Title</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={content.whyUs.title} onChange={e => setContent({...content, whyUs: {...content.whyUs, title: e.target.value}})} />
                           </div>
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-4">Items</h3>
                           {content.whyUs.items.map((item, idx) => (
                               <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 relative group">
                                    <button onClick={() => removeWhyUs(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-xs text-slate-400">Title</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={item.title} onChange={e => updateWhyUs(idx, 'title', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-slate-400">Description</label>
                                            <textarea className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm h-16" 
                                                value={item.description} onChange={e => updateWhyUs(idx, 'description', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400">Icon</label>
                                            <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={item.icon} onChange={e => updateWhyUs(idx, 'icon', e.target.value)} />
                                        </div>
                                         <div>
                                            <label className="text-xs text-slate-400">Color</label>
                                            <select className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-sm" 
                                                value={item.color} onChange={e => updateWhyUs(idx, 'color', e.target.value)}>
                                                    <option value="indigo">Indigo</option>
                                                    <option value="yellow">Yellow</option>
                                                    <option value="cyan">Cyan</option>
                                                    <option value="rose">Rose</option>
                                                    <option value="emerald">Emerald</option>
                                            </select>
                                        </div>
                                    </div>
                               </div>
                           ))}
                            <button onClick={addWhyUs} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center">
                               <Plus size={16} className="mr-2"/> Add Item
                           </button>
                       </div>
                   )}

                    {(activeTab === 'TEAM' || activeTab === 'BLOG') && (
                       <div className="space-y-6">
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Section Title</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" 
                                      value={activeTab === 'TEAM' ? content.teamTeaser.title : content.blog.title} 
                                      onChange={e => activeTab === 'TEAM' 
                                        ? setContent({...content, teamTeaser: {...content.teamTeaser, title: e.target.value}})
                                        : setContent({...content, blog: {...content.blog, title: e.target.value}})
                                      } />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Description</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white h-24" 
                                      value={activeTab === 'TEAM' ? content.teamTeaser.description : content.blog.description} 
                                      onChange={e => activeTab === 'TEAM'
                                        ? setContent({...content, teamTeaser: {...content.teamTeaser, description: e.target.value}})
                                        : setContent({...content, blog: {...content.blog, description: e.target.value}})
                                      } />
                           </div>
                       </div>
                   )}

              </div>

              {/* Preview Side */}
              <div className="hidden lg:block">
                  <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Live Preview (Approximation)</h2>
                  
                  <div className="bg-black border border-slate-800 rounded-xl overflow-y-auto h-[600px] relative p-8">
                       {/* Hero Preview */}
                       {activeTab === 'HERO' && (
                           <div className="flex flex-col items-center text-center space-y-6 mt-10">
                               <div className="inline-block px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium uppercase tracking-wider">
                                   {content.hero.badgeText}
                               </div>
                               <h1 className="text-4xl font-bold text-white tracking-tight">
                                   {content.hero.title}
                               </h1>
                               <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-xl font-bold tracking-widest uppercase">
                                   {content.hero.subtitle}
                               </div>
                               <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                                   {content.hero.description}
                               </p>
                               <div className="text-white font-medium border-l-2 border-indigo-500 pl-4 text-left">
                                   {content.hero.highlight}
                               </div>
                           </div>
                       )}

                       {activeTab === 'METRICS' && (
                           <div className="grid grid-cols-2 gap-4 mt-10">
                               {content.metrics.map(m => (
                                   <div key={m.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                                       <div className={`p-2 rounded-lg bg-${m.color}-500/10 text-${m.color}-500 mb-2`}>
                                           {renderIcon(m.icon, "w-6 h-6")}
                                       </div>
                                       <div className="text-2xl font-bold text-white">{m.value}</div>
                                       <div className="text-xs text-slate-500 uppercase tracking-wider">{m.label}</div>
                                   </div>
                               ))}
                           </div>
                       )}

                       {activeTab === 'METHOD' && (
                           <div className="mt-4 space-y-8">
                               <div className="text-center">
                                   <h2 className="text-2xl font-bold text-white mb-2">{content.methodology.title}</h2>
                                   <p className="text-slate-400 text-sm">{content.methodology.description}</p>
                               </div>
                               <div className="space-y-4">
                                   {content.methodology.steps.map((step, i) => (
                                       <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                                           <div className="text-2xl font-bold text-slate-700">{step.stepNumber}</div>
                                           <div>
                                               <h3 className="text-white font-bold flex items-center mb-1">
                                                   {renderIcon(step.icon, "w-4 h-4 mr-2 text-indigo-500")}
                                                   {step.title}
                                               </h3>
                                               <p className="text-slate-400 text-xs leading-relaxed">{step.description}</p>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       )}

                       {activeTab === 'TECH' && (
                           <div className="mt-10 text-center">
                               <h2 className="text-2xl font-bold text-white mb-6">{content.techStack.title}</h2>
                               <div className="flex flex-wrap justify-center gap-2 mb-8">
                                   {content.techStack.techItems.map(item => (
                                       <span key={item} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-cyan-400">
                                           {item}
                                       </span>
                                   ))}
                               </div>
                               <div className="flex flex-wrap justify-center gap-2">
                                   {content.techStack.creativeItems.map(item => (
                                       <span key={item} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-fuchsia-400">
                                           {item}
                                       </span>
                                   ))}
                               </div>
                           </div>
                       )}

                        {activeTab === 'WHY' && (
                           <div className="mt-10 space-y-4">
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">{content.whyUs.title}</h2>
                                {content.whyUs.items.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <div className={`p-2 h-fit rounded bg-${item.color}-500/10 text-${item.color}-500`}>
                                            {renderIcon(item.icon, "w-5 h-5")}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                                            <p className="text-slate-400 text-xs">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                           </div>
                       )}

                       {(activeTab === 'TEAM' || activeTab === 'BLOG') && (
                           <div className="mt-20 text-center">
                               <h2 className="text-3xl font-bold text-white mb-4">
                                   {activeTab === 'TEAM' ? content.teamTeaser.title : content.blog.title}
                               </h2>
                               <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
                                   {activeTab === 'TEAM' ? content.teamTeaser.description : content.blog.description}
                               </p>
                               <div className="mt-8 grid grid-cols-2 gap-4 opacity-50">
                                    <div className="h-24 bg-slate-800 rounded-lg animate-pulse"></div>
                                    <div className="h-24 bg-slate-800 rounded-lg animate-pulse"></div>
                               </div>
                           </div>
                       )}

                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ContentManager;