import { Users, Play, Clock, CheckCircle2, XCircle, Globe, TrendingUp, Activity, Zap } from 'lucide-react';
import type { Profile, Job } from '../types';

interface DashboardProps {
  profiles: Profile[];
  jobs: Job[];
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ profiles, jobs, setActiveTab }: DashboardProps) {
  const running = profiles.filter(p => p.status === 'running').length;
  const starting = profiles.filter(p => p.status === 'starting').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const runningJobs = jobs.filter(j => j.status === 'running').length;
  const completedJobs = jobs.filter(j => j.status === 'done').length;
  const failedJobs = jobs.filter(j => j.status === 'failed').length;
  const uniqueStates = [...new Set(profiles.map(p => p.proxy.state))].length;

  const stats = [
    {
      label: 'Total Profiles', value: profiles.length, icon: Users,
      color: 'blue', sub: `${running} running`, subColor: 'text-green-400',
    },
    {
      label: 'Running Now', value: running + starting, icon: Play,
      color: 'green', sub: starting > 0 ? `${starting} starting...` : 'All stable', subColor: 'text-yellow-400',
    },
    {
      label: 'Active Proxies', value: profiles.filter(p => p.status === 'running').length, icon: Globe,
      color: 'purple', sub: `${uniqueStates} unique states`, subColor: 'text-purple-300',
    },
    {
      label: 'Jobs Queued', value: pendingJobs + runningJobs, icon: Clock,
      color: 'yellow', sub: `${completedJobs} completed`, subColor: 'text-gray-400',
    },
    {
      label: 'Completed Jobs', value: completedJobs, icon: CheckCircle2,
      color: 'emerald', sub: `${failedJobs} failed`, subColor: 'text-red-400',
    },
    {
      label: 'Failed Jobs', value: failedJobs, icon: XCircle,
      color: 'red', sub: 'Auto-retry enabled', subColor: 'text-gray-400',
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  };

  const recentJobs = jobs.slice(0, 8);
  const activeProfiles = profiles.filter(p => p.status === 'running' || p.status === 'starting');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time overview of your automation system</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-300 text-sm font-medium">Live Monitoring</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub, subColor }) => (
          <div key={label} className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
                <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center`}>
                <Icon size={20} className="opacity-80" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Profiles */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Activity size={16} className="text-green-400" />
              Active Profiles
            </h2>
            <button onClick={() => setActiveTab('profiles')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              View All →
            </button>
          </div>
          {activeProfiles.length === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No active profiles</p>
              <button onClick={() => setActiveTab('profiles')}
                className="mt-3 text-xs text-red-400 hover:text-red-300 border border-red-600/30 px-3 py-1.5 rounded-lg transition-colors">
                Create Profile
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {activeProfiles.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-medium truncate">{p.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium
                        ${p.os === 'Windows' ? 'bg-blue-900/50 text-blue-400' :
                          p.os === 'Android' ? 'bg-green-900/50 text-green-400' :
                          'bg-purple-900/50 text-purple-400'}`}>
                        {p.os}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs truncate">{p.currentAction}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {p.ip && <div className="text-gray-400 text-xs">{p.ip}</div>}
                    <div className="text-gray-600 text-xs">{p.proxy.state}/{p.proxy.city}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              Recent Jobs
            </h2>
            <button onClick={() => setActiveTab('jobs')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              View All →
            </button>
          </div>
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No jobs yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentJobs.map(j => (
                <div key={j.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0
                    ${j.status === 'done' ? 'bg-green-500' :
                      j.status === 'running' ? 'bg-blue-500 animate-pulse' :
                      j.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">
                      {j.taskType.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-gray-500 text-xs truncate">{j.profileName}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${j.status === 'done' ? 'bg-green-900/40 text-green-400' :
                      j.status === 'running' ? 'bg-blue-900/40 text-blue-400' :
                      j.status === 'failed' ? 'bg-red-900/40 text-red-400' :
                      'bg-yellow-900/40 text-yellow-400'}`}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-400" />
          Tech Stack Status
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: 'Playwright CDP', status: 'Active', color: 'green', desc: 'Browser Control' },
            { name: 'MoreLogin API', status: 'Connected', color: 'green', desc: 'localhost:8080' },
            { name: 'Smartproxy', status: 'Active', color: 'green', desc: 'us.smartproxy.net:3120' },
            { name: 'SQLite WAL', status: 'Healthy', color: 'green', desc: 'All data stored' },
            { name: 'MCP Server', status: 'Ready', color: 'blue', desc: 'Claude AI Control' },
          ].map(({ name, status, color, desc }) => (
            <div key={name} className="bg-gray-800/60 rounded-xl p-3 text-center">
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-2 
                ${color === 'green' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
              <div className="text-white text-xs font-semibold">{name}</div>
              <div className={`text-xs mt-1 ${color === 'green' ? 'text-green-400' : 'text-blue-400'}`}>{status}</div>
              <div className="text-gray-600 text-xs mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
