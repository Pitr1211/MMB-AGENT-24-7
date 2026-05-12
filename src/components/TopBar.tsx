import { useEffect, useState } from 'react';
import { Activity, Wifi } from 'lucide-react';
import type { Profile, LogEntry } from '../types';

interface TopBarProps {
  profiles: Profile[];
  logs: LogEntry[];
  activeTab: string;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  profiles: 'Profile Manager',
  jobs: 'Job Queue',
  proxy: 'Proxy Manager',
  logs: 'Activity Logs',
  settings: 'Settings',
};

export default function TopBar({ profiles, logs, activeTab }: TopBarProps) {
  const [time, setTime] = useState(new Date());


  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const running = profiles.filter(p => p.status === 'running').length;
  const lastLog = logs[0];

  return (
    <div className="h-12 bg-gray-950 border-b border-gray-800 flex items-center px-5 gap-4 flex-shrink-0">
      {/* Page title */}
      <h2 className="text-gray-300 font-medium text-sm">{TAB_TITLES[activeTab] || 'Dashboard'}</h2>

      <div className="w-px h-4 bg-gray-800" />

      {/* Live activity ticker */}
      {lastLog && (
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse
              ${lastLog.level === 'error' ? 'bg-red-500' :
                lastLog.level === 'warn' ? 'bg-yellow-500' :
                lastLog.level === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
            <span className="text-gray-600 text-xs">Latest:</span>
          </div>
          <span className="text-gray-400 text-xs truncate">{lastLog.message}</span>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-4 ml-auto flex-shrink-0">
        {/* Running indicator */}
        <div className="flex items-center gap-1.5">
          <Activity size={12} className="text-green-500" />
          <span className="text-gray-500 text-xs">{running} active</span>
        </div>

        {/* Network status */}
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className="text-blue-400" />
          <span className="text-gray-500 text-xs">us.smartproxy.net:3120</span>
        </div>

        <div className="w-px h-4 bg-gray-800" />

        {/* Time */}
        <span className="text-gray-600 text-xs font-mono">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
