
import React, { useState, useEffect } from 'react';
import { 
  Save, RefreshCw, Upload, Download, Globe, Link, Share2, Search, 
  Settings, ToggleLeft, ToggleRight, Plus, Trash2, ArrowUp, ArrowDown, MoveUp, MoveDown
} from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../services/apiService';
import { SiteSettings, FooterLink } from '../types';

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'FOOTER' | 'SOCIAL' | 'SEO' | 'FEATURES'>('GENERAL');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const data = await getSiteSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await updateSiteSettings(settings);
    setSaving(false);
    alert('Settings updated successfully!');
  };

  const handleReset = () => {
    if(window.confirm("Discard unsaved changes and reload settings?")) {
        fetchSettings();
    }
  };

  const handleExport = () => {
      if (!settings) return;
      const json = JSON.stringify(settings, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `site-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const importedSettings = JSON.parse(event.target?.result as string);
              // Basic validation check
              if (importedSettings.general && importedSettings.footer) {
                  setSettings(importedSettings);
                  alert('Settings imported successfully. Click Save to apply.');
              } else {
                  alert('Invalid settings file format.');
              }
          } catch (err) {
              alert('Error parsing JSON file.');
          }
      };
      reader.readAsText(file);
      // Reset input
      e.target.value = '';
  };

  // --- HELPER COMPONENTS ---

  const ToggleSwitch = ({ checked, onChange, label, description }: { checked: boolean, onChange: (val: boolean) => void, label: string, description?: string }) => (
      <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div>
              <div className="text-white font-medium">{label}</div>
              {description && <div className="text-xs text-slate-400 mt-1">{description}</div>}
          </div>
          <button 
              onClick={() => onChange(!checked)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-600'}`}
          >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
      </div>
  );

  const LinkListEditor = ({ 
      links, 
      onChange, 
      title 
  }: { 
      links: FooterLink[], 
      onChange: (links: FooterLink[]) => void, 
      title: string 
  }) => {
      const addLink = () => {
          const newLink: FooterLink = {
              id: Math.random().toString(36).substr(2, 5),
              label: 'New Link',
              url: '/',
              order: links.length + 1
          };
          onChange([...links, newLink]);
      };

      const updateLink = (index: number, field: keyof FooterLink, value: any) => {
          const newLinks = [...links];
          newLinks[index] = { ...newLinks[index], [field]: value };
          onChange(newLinks);
      };

      const removeLink = (index: number) => {
          onChange(links.filter((_, i) => i !== index));
      };
      
      const moveLink = (index: number, direction: 'up' | 'down') => {
          const newLinks = [...links];
          if (direction === 'up' && index > 0) {
              [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
          } else if (direction === 'down' && index < newLinks.length - 1) {
              [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
          }
          // Update order property as well if needed, but array order is enough for UI
          onChange(newLinks);
      };

      return (
          <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
                  <button onClick={addLink} className="text-xs flex items-center bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-white transition-colors">
                      <Plus size={12} className="mr-1" /> Add
                  </button>
              </div>
              <div className="space-y-2">
                  {links.map((link, idx) => (
                      <div key={link.id} className="flex gap-2 items-center bg-slate-800/50 p-2 rounded border border-slate-700">
                          <div className="flex flex-col space-y-1">
                                <button type="button" onClick={() => moveLink(idx, 'up')} className="text-slate-600 hover:text-white disabled:opacity-30" disabled={idx===0}><MoveUp size={12}/></button>
                                <button type="button" onClick={() => moveLink(idx, 'down')} className="text-slate-600 hover:text-white disabled:opacity-30" disabled={idx === links.length - 1}><MoveDown size={12}/></button>
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                              <input 
                                  type="text" 
                                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" 
                                  value={link.label}
                                  onChange={(e) => updateLink(idx, 'label', e.target.value)}
                                  placeholder="Label"
                              />
                              <input 
                                  type="text" 
                                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" 
                                  value={link.url}
                                  onChange={(e) => updateLink(idx, 'url', e.target.value)}
                                  placeholder="URL"
                              />
                          </div>
                          <button onClick={() => removeLink(idx)} className="text-slate-500 hover:text-red-400 p-1">
                              <Trash2 size={14} />
                          </button>
                      </div>
                  ))}
                  {links.length === 0 && <div className="text-xs text-slate-500 italic">No links in this section.</div>}
              </div>
          </div>
      );
  };

  if (loading) return <div className="p-8 text-white">Loading settings...</div>;
  if (!settings) return <div className="p-8 text-white">Error loading settings.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h1 className="text-2xl font-bold text-white">Site Settings</h1>
           <p className="text-slate-400 mt-1">Configure global application settings.</p>
        </div>
        <div className="flex gap-2">
            <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center transition-colors border border-slate-700 cursor-pointer">
                <Upload size={18} className="mr-2" /> Import
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
            <button 
                onClick={handleExport}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center transition-colors border border-slate-700"
            >
                <Download size={18} className="mr-2" /> Export
            </button>
            <button 
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center transition-colors border border-slate-700"
            >
                <RefreshCw size={18} className="mr-2" /> Reset
            </button>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden border border-slate-800 rounded-xl bg-slate-900">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
               {[
                   { id: 'GENERAL', label: 'General', icon: <Settings size={16}/> },
                   { id: 'FOOTER', label: 'Footer Links', icon: <Link size={16}/> },
                   { id: 'SOCIAL', label: 'Social Media', icon: <Share2 size={16}/> },
                   { id: 'SEO', label: 'SEO', icon: <Globe size={16}/> },
                   { id: 'FEATURES', label: 'Feature Toggles', icon: <ToggleLeft size={16}/> },
               ].map((tab) => (
                   <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-4 text-left font-medium text-sm flex items-center border-l-2 transition-colors
                      ${activeTab === tab.id ? 'border-indigo-500 bg-slate-900 text-white' : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                   >
                       <span className="mr-3">{tab.icon}</span>
                       {tab.label}
                   </button>
               ))}
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-8">
               <div className="max-w-3xl">
                   {activeTab === 'GENERAL' && (
                       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">General Information</h2>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Site Name</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                      value={settings.general.siteName} onChange={e => setSettings({...settings, general: {...settings.general, siteName: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Site Description</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-20" 
                                      value={settings.general.siteDescription} onChange={e => setSettings({...settings, general: {...settings.general, siteDescription: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Footer Short Description</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-20" 
                                      value={settings.general.footerDescription} onChange={e => setSettings({...settings, general: {...settings.general, footerDescription: e.target.value}})} />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                   <label className="text-sm font-medium text-slate-300">Contact Email</label>
                                   <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                          value={settings.general.contactEmail} onChange={e => setSettings({...settings, general: {...settings.general, contactEmail: e.target.value}})} />
                               </div>
                               <div className="space-y-2">
                                   <label className="text-sm font-medium text-slate-300">Careers Email</label>
                                   <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                          value={settings.general.careersEmail} onChange={e => setSettings({...settings, general: {...settings.general, careersEmail: e.target.value}})} />
                               </div>
                           </div>
                       </div>
                   )}

                   {activeTab === 'FOOTER' && (
                       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Footer Links Management</h2>
                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                               <LinkListEditor 
                                    title="Divisions" 
                                    links={settings.footer.divisionLinks} 
                                    onChange={(newLinks) => setSettings({...settings, footer: {...settings.footer, divisionLinks: newLinks}})}
                                />
                                <LinkListEditor 
                                    title="Company" 
                                    links={settings.footer.companyLinks} 
                                    onChange={(newLinks) => setSettings({...settings, footer: {...settings.footer, companyLinks: newLinks}})}
                                />
                                <LinkListEditor 
                                    title="Other / Legal" 
                                    links={settings.footer.otherLinks} 
                                    onChange={(newLinks) => setSettings({...settings, footer: {...settings.footer, otherLinks: newLinks}})}
                                />
                           </div>
                       </div>
                   )}

                   {activeTab === 'SOCIAL' && (
                       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Social Media Profiles</h2>
                           <div className="space-y-4">
                               {Object.entries(settings.social).map(([key, value]) => (
                                   <div key={key} className="space-y-2">
                                       <label className="text-sm font-medium text-slate-300 capitalize">{key} URL</label>
                                       <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                              value={value} 
                                              onChange={e => setSettings({...settings, social: {...settings.social, [key]: e.target.value}})} 
                                              placeholder={`https://${key}.com/...`}
                                       />
                                   </div>
                               ))}
                           </div>
                       </div>
                   )}

                   {activeTab === 'SEO' && (
                       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">SEO Configuration</h2>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Default Meta Title</label>
                               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                      value={settings.seo.defaultMetaTitle} onChange={e => setSettings({...settings, seo: {...settings.seo, defaultMetaTitle: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Default Meta Description</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-24" 
                                      value={settings.seo.defaultMetaDescription} onChange={e => setSettings({...settings, seo: {...settings.seo, defaultMetaDescription: e.target.value}})} />
                           </div>
                           <div className="space-y-2">
                               <label className="text-sm font-medium text-slate-300">Keywords (Comma separated)</label>
                               <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white h-20" 
                                      value={settings.seo.keywords.join(', ')} 
                                      onChange={e => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value.split(',').map(s=>s.trim())}})} />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                   <label className="text-sm font-medium text-slate-300">Google Analytics ID</label>
                                   <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                          value={settings.seo.googleAnalyticsId} onChange={e => setSettings({...settings, seo: {...settings.seo, googleAnalyticsId: e.target.value}})} />
                               </div>
                               <div className="space-y-2">
                                   <label className="text-sm font-medium text-slate-300">Facebook Pixel ID</label>
                                   <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white" 
                                          value={settings.seo.facebookPixelId} onChange={e => setSettings({...settings, seo: {...settings.seo, facebookPixelId: e.target.value}})} />
                               </div>
                           </div>
                       </div>
                   )}

                   {activeTab === 'FEATURES' && (
                       <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Feature Toggles</h2>
                           <div className="space-y-4">
                               <ToggleSwitch 
                                    label="Chat Assistant" 
                                    description="Enable the AI chatbot widget on the public site."
                                    checked={settings.features.enableChatAssistant}
                                    onChange={(v) => setSettings({...settings, features: {...settings.features, enableChatAssistant: v}})}
                               />
                               <ToggleSwitch 
                                    label="Newsletter Signup" 
                                    description="Show newsletter subscription forms in footer/modals."
                                    checked={settings.features.enableNewsletter}
                                    onChange={(v) => setSettings({...settings, features: {...settings.features, enableNewsletter: v}})}
                               />
                               <ToggleSwitch 
                                    label="Quiz Tools" 
                                    description="Enable interactive project estimation quizzes."
                                    checked={settings.features.enableQuizTools}
                                    onChange={(v) => setSettings({...settings, features: {...settings.features, enableQuizTools: v}})}
                               />
                               <ToggleSwitch 
                                    label="Maintenance Mode" 
                                    description="Show a maintenance page to all public visitors."
                                    checked={settings.features.maintenanceMode}
                                    onChange={(v) => setSettings({...settings, features: {...settings.features, maintenanceMode: v}})}
                               />
                           </div>
                       </div>
                   )}
               </div>
          </div>
      </div>
    </div>
  );
};

export default SettingsManager;
