
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  Calendar, Download, Users, MousePointer, Activity, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Globe, Share2, Search, FileText
} from 'lucide-react';
import { 
  getAnalyticsOverview, getTrafficSources, getPagePerformance, 
  getUserBehavior, getLeadAnalytics, getContentPerformance 
} from '../services/apiService';
import { 
  AnalyticsOverview, TrafficSource, PageMetric, UserBehavior, 
  LeadAnalytics, ContentPerformance 
} from '../types';

const AnalyticsManager: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRAFFIC' | 'BEHAVIOR' | 'LEADS'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  // Data States
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [traffic, setTraffic] = useState<TrafficSource[]>([]);
  const [pages, setPages] = useState<PageMetric[]>([]);
  const [behavior, setBehavior] = useState<UserBehavior | null>(null);
  const [leads, setLeads] = useState<LeadAnalytics | null>(null);
  const [contentPerf, setContentPerf] = useState<ContentPerformance | null>(null);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    const [ov, tr, pg, bh, ld, cp] = await Promise.all([
        getAnalyticsOverview(dateRange),
        getTrafficSources(dateRange),
        getPagePerformance(dateRange),
        getUserBehavior(dateRange),
        getLeadAnalytics(dateRange),
        getContentPerformance(dateRange)
    ]);
    setOverview(ov);
    setTraffic(tr);
    setPages(pg);
    setBehavior(bh);
    setLeads(ld);
    setContentPerf(cp);
    setLoading(false);
  };

  const handleExport = () => {
      alert("Generating comprehensive analytics report (PDF/CSV)...");
  };

  // --- SUB-COMPONENTS ---

  const StatCard = ({ title, value, subtext, trend, icon: Icon, color }: any) => (
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
                  <Icon size={24} />
              </div>
              {trend && (
                  <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {trend > 0 ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                      {Math.abs(trend)}%
                  </div>
              )}
          </div>
          <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
      </div>
  );

  if (loading) return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
           <p className="text-slate-400 mt-1">Track performance, traffic, and engagement.</p>
        </div>
        <div className="flex gap-2">
            <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="3m">Last 3 Months</option>
                <option value="1y">Last Year</option>
            </select>
            <button 
                onClick={handleExport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Download size={18} className="mr-2" /> Export
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex space-x-6 overflow-x-auto">
          {[
              { id: 'OVERVIEW', label: 'Overview' },
              { id: 'TRAFFIC', label: 'Traffic & Pages' },
              { id: 'BEHAVIOR', label: 'User Behavior' },
              { id: 'LEADS', label: 'Leads Funnel' },
          ].map(tab => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.id 
                      ? 'border-indigo-500 text-indigo-400' 
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'}`}
              >
                  {tab.label}
              </button>
          ))}
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'OVERVIEW' && overview && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                      title="Total Page Views" 
                      value={overview.totalPageViews.toLocaleString()} 
                      trend={12.5} 
                      icon={MousePointer} 
                      color="indigo" 
                  />
                  <StatCard 
                      title="Unique Visitors" 
                      value={overview.uniqueVisitors.toLocaleString()} 
                      trend={8.2} 
                      icon={Users} 
                      color="cyan" 
                  />
                  <StatCard 
                      title="Bounce Rate" 
                      value={`${overview.bounceRate}%`} 
                      trend={-2.1} 
                      icon={Activity} 
                      color="rose" 
                      subtext="Lower is better"
                  />
                  <StatCard 
                      title="Avg. Session Duration" 
                      value={overview.avgSessionDuration} 
                      icon={TrendingUp} 
                      color="emerald" 
                  />
              </div>

              {/* Main Trend Chart */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-6">Traffic Trends</h3>
                  <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={overview.trendData}>
                              <defs>
                                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip 
                                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                  itemStyle={{ color: '#e2e8f0' }}
                              />
                              <Legend />
                              <Area type="monotone" dataKey="views" name="Page Views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" />
                              <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVisitors)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      )}

      {/* --- TRAFFIC TAB --- */}
      {activeTab === 'TRAFFIC' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Traffic Sources */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                      <h3 className="text-lg font-bold text-white mb-6">Traffic Sources</h3>
                      <div className="h-[250px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={traffic}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="visitors"
                                  >
                                      {traffic.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="space-y-3 mt-4">
                          {traffic.map((t, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center">
                                      <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: t.fill}}></span>
                                      <span className="text-slate-300">{t.source}</span>
                                  </div>
                                  <div className="flex items-center">
                                      <span className="text-white font-bold mr-2">{t.percentage}%</span>
                                      <span className="text-slate-500 text-xs">({t.visitors})</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Top Pages Table */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-slate-800">
                          <h3 className="text-lg font-bold text-white">Top Page Performance</h3>
                      </div>
                      <div className="overflow-x-auto flex-1">
                          <table className="w-full text-left">
                              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                                  <tr>
                                      <th className="px-6 py-4 font-semibold">Page Path</th>
                                      <th className="px-6 py-4 font-semibold">Views</th>
                                      <th className="px-6 py-4 font-semibold">Unique</th>
                                      <th className="px-6 py-4 font-semibold">Avg. Time</th>
                                      <th className="px-6 py-4 font-semibold">Bounce</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800 text-sm">
                                  {pages.map((page, i) => (
                                      <tr key={i} className="hover:bg-slate-800/50">
                                          <td className="px-6 py-4 text-indigo-400 font-medium">{page.path}</td>
                                          <td className="px-6 py-4 text-slate-200">{page.views}</td>
                                          <td className="px-6 py-4 text-slate-400">{page.uniqueViews}</td>
                                          <td className="px-6 py-4 text-slate-300">{page.avgTime}</td>
                                          <td className="px-6 py-4">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${page.bounceRate < 30 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                  {page.bounceRate}%
                                              </span>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- BEHAVIOR TAB --- */}
      {activeTab === 'BEHAVIOR' && behavior && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Top Queries */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                       <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Search size={20} className="mr-2 text-indigo-400"/> Top Search Queries</h3>
                       <div className="space-y-4">
                           {behavior.topQueries.map((q, i) => (
                               <div key={i} className="relative">
                                   <div className="flex justify-between text-sm mb-1 relative z-10">
                                       <span className="text-slate-300 font-medium">{q.query}</span>
                                       <span className="text-slate-400">{q.count} searches</span>
                                   </div>
                                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                       <div 
                                          className="h-full bg-indigo-500 rounded-full" 
                                          style={{ width: `${(q.count / behavior.topQueries[0].count) * 100}%` }}
                                       ></div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Division Interest */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Activity size={20} className="mr-2 text-fuchsia-400"/> Division Interest</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={behavior.divisionInterest} margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="division" type="category" stroke="#94a3b8" fontSize={12} width={60} />
                                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                                    <Bar dataKey="percentage" name="Interest %" radius={[0, 4, 4, 0]}>
                                        {behavior.divisionInterest.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                   </div>

                   {/* Top Projects */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center"><Globe size={20} className="mr-2 text-cyan-400"/> Most Viewed Projects</h3>
                        <ul className="space-y-3">
                            {behavior.topProjects.map((p, i) => (
                                <li key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-200 font-medium text-sm">{p.title}</span>
                                    <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">{p.views} views</span>
                                </li>
                            ))}
                        </ul>
                   </div>

                   {/* Top Blog Posts */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center"><FileText size={20} className="mr-2 text-emerald-400"/> Most Popular Articles</h3>
                        <ul className="space-y-3">
                            {behavior.topBlogPosts.map((p, i) => (
                                <li key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-200 font-medium text-sm">{p.title}</span>
                                    <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded">{p.views} views</span>
                                </li>
                            ))}
                        </ul>
                   </div>
               </div>
          </div>
      )}

      {/* --- LEADS TAB --- */}
      {activeTab === 'LEADS' && leads && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Funnel */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Conversion Funnel</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leads.funnel} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                    <XAxis type="number" stroke="#94a3b8" />
                                    <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={12} width={70} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                                        {leads.funnel.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Leads Source */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Leads by Source</h3>
                         <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={leads.leadsBySource}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                    >
                                        <Cell fill="#6366f1" />
                                        <Cell fill="#06b6d4" />
                                        <Cell fill="#d946ef" />
                                        <Cell fill="#10b981" />
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
               </div>

               {/* Stats Grid for Content Performance */}
               {contentPerf && (
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Engagement Metrics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-indigo-400 font-bold text-2xl mb-1">{contentPerf.blogTotalViews.toLocaleString()}</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Total Blog Views</div>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-cyan-400 font-bold text-2xl mb-1">{contentPerf.projectTotalViews.toLocaleString()}</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Total Project Views</div>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-emerald-400 font-bold text-2xl mb-1">{contentPerf.newsletterOpenRate}%</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Newsletter Open Rate</div>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <div className="text-fuchsia-400 font-bold text-2xl mb-1">{contentPerf.chatInteractions}</div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">AI Chat Interactions</div>
                            </div>
                        </div>
                    </div>
               )}
          </div>
      )}
    </div>
  );
};

export default AnalyticsManager;
