import {
  LayoutDashboard, Users, Globe, Settings, FileText, Cpu, BrainCircuit, Server, Tv
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profiles', label: 'Profiles', icon: Users },
  { id: 'channels', label: 'Channels', icon: Tv },
  { id: 'jobs', label: 'Job Queue', icon: Cpu },
  { id: 'proxy', label: 'Proxy Manager', icon: Globe },
  { id: 'logs', label: 'Activity Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  runningCount: number;
  pendingJobs: number;
  activeChannels?: number;
}

export default function Sidebar({ activeTab, setActiveTab, runningCount, pendingJobs, activeChannels = 0 }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/50">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M21.8 8s-.195-1.377-.795-1.984c-.76-.797-1.613-.8-2.004-.847-2.798-.203-6.996-.203-6.996-.203h-.01s-4.197 0-6.996.202c-.39.046-1.242.05-2.003.847C2.395 6.623 2.2 8 2.2 8S2 9.62 2 11.24v1.517c0 1.618.2 3.237.2 3.237s.195 1.378.795 1.985c.76.797 1.76.771 2.205.855C6.8 19.01 12 19.06 12 19.06s4.203-.007 7.001-.208c.39-.047 1.243-.05 2.004-.847.6-.607.795-1.985.795-1.985S22 14.375 22 12.757V11.24C22 9.62 21.8 8 21.8 8zM9.935 14.595V9.404l5.403 2.602-5.403 2.59z"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">YT Bot Manager</div>
            <div className="text-gray-500 text-xs">Pro Dashboard v2.0</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group
              ${activeTab === id
                ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent'
              }`}
          >
            <Icon size={16} className={activeTab === id ? 'text-red-400' : 'text-gray-500 group-hover:text-gray-300'} />
            <span>{label}</span>
            {id === 'profiles' && runningCount > 0 && (
              <span className="ml-auto text-xs bg-green-600/30 text-green-400 border border-green-600/30 px-1.5 py-0.5 rounded-full">
                {runningCount}
              </span>
            )}
            {id === 'channels' && activeChannels > 0 && (
              <span className="ml-auto text-xs bg-blue-600/30 text-blue-400 border border-blue-600/30 px-1.5 py-0.5 rounded-full">
                {activeChannels}
              </span>
            )}
            {id === 'jobs' && pendingJobs > 0 && (
              <span className="ml-auto text-xs bg-yellow-600/30 text-yellow-400 border border-yellow-600/30 px-1.5 py-0.5 rounded-full">
                {pendingJobs}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Status */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="bg-gray-900 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Server size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400 text-xs">MoreLogin: Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400 text-xs">Smartproxy: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-gray-400 text-xs">SQLite WAL: OK</span>
          </div>
          <div className="flex items-center gap-2">
            <BrainCircuit size={12} className="text-purple-400" />
            <span className="text-gray-400 text-xs">MCP Server: Ready</span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-gray-600 text-xs">Node.js v22.15.0 • PM2</span>
        </div>
      </div>
    </aside>
  );
}
