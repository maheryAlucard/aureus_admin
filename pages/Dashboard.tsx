import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, FileText, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { getDashboardStats, getAnalyticsData, getDivisionDistribution } from '../services/apiService';
import { DashboardStats, AnalyticsData, ChartData } from '../types';

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: 'indigo' | 'cyan' | 'fuchsia' | 'emerald';
}> = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-500',
    cyan: 'bg-cyan-500/10 text-cyan-500',
    fuchsia: 'bg-fuchsia-500/10 text-fuchsia-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full flex items-center">
            <TrendingUp size={12} className="mr-1" /> {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<AnalyticsData[]>([]);
  const [divisionData, setDivisionData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [s, c, d] = await Promise.all([
        getDashboardStats(),
        getAnalyticsData(),
        getDivisionDistribution()
      ]);
      setStats(s);
      setChartData(c);
      setDivisionData(d);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back, Administrator.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={stats?.revenue || '-'} 
          icon={<DollarSign size={24} />} 
          trend="+12.5%"
          color="emerald"
        />
        <StatsCard 
          title="Active Leads" 
          value={stats?.activeLeads || 0} 
          icon={<Users size={24} />} 
          trend="+5 new"
          color="cyan"
        />
        <StatsCard 
          title="Total Projects" 
          value={stats?.totalProjects || 0} 
          icon={<Activity size={24} />} 
          color="indigo"
        />
        <StatsCard 
          title="Blog Posts" 
          value={stats?.blogPosts || 0} 
          icon={<FileText size={24} />} 
          color="fuchsia"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Leads & Projects Trend</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="projects" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorProjects)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Division Distribution Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Revenue by Division</h3>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={divisionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {divisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4">
                {divisionData.map((d) => (
                    <div key={d.name} className="flex items-center text-xs text-slate-400">
                        <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: d.fill }}></span>
                        {d.name}
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Mock */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <button className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center">
                View All <ArrowRight size={14} className="ml-1" />
            </button>
        </div>
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold mr-4">
                        JD
                    </div>
                    <div>
                        <p className="text-sm text-slate-200">
                            <span className="font-bold text-white">John Doe</span> submitted a new lead for <span className="text-cyan-400">Tech Division</span>.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;