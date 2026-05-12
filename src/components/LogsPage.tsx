import { useState } from 'react';
import { Trash2, Download, Search } from 'lucide-react';
import type { LogEntry } from '../types';

interface LogsPageProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LEVEL_CONFIG = {
  info: { label: 'INFO', color: 'text-blue-400', badge: 'bg-blue-900/30 border-blue-600/30', dot: 'bg-blue-500' },
  warn: { label: 'WARN', color: 'text-yellow-400', badge: 'bg-yellow-900/30 border-yellow-600/30', dot: 'bg-yellow-500' },
  error: { label: 'ERROR', color: 'text-red-400', badge: 'bg-red-900/30 border-red-600/30', dot: 'bg-red-500' },
  success: { label: 'SUCCESS', color: 'text-green-400', badge: 'bg-green-900/30 border-green-600/30', dot: 'bg-green-500' },
};

export default function LogsPage({ logs, onClear }: LogsPageProps) {
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'success'>('all');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    if (filter !== 'all' && l.level !== filter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) &&
        !l.profileName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    info: logs.filter(l => l.level === 'info').length,
    warn: logs.filter(l => l.level === 'warn').length,
    error: logs.filter(l => l.level === 'error').length,
    success: logs.filter(l => l.level === 'success').length,
  };

  const exportLogs = () => {
    const text = logs.map(l =>
      `[${new Date(l.timestamp).toISOString()}] [${l.level.toUpperCase()}] ${l.profileName ? `[${l.profileName}] ` : ''}${l.message}`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ytbot-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
            <p className="text-gray-500 text-sm mt-0.5">{logs.length} total entries — Real-time system activity</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportLogs}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all text-sm">
              <Download size={14} />
              Export
            </button>
            <button onClick={onClear}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-900/30 border border-red-700/30 text-red-400 hover:bg-red-900/50 transition-all text-sm">
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'success', 'info', 'warn', 'error'] as const).map(l => {
              const conf = l === 'all' ? null : LEVEL_CONFIG[l];
              return (
                <button key={l} onClick={() => setFilter(l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all uppercase
                    ${filter === l
                      ? l === 'all' ? 'bg-gray-700 border-gray-600 text-white'
                        : conf!.badge + ' ' + conf!.color
                      : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                  {conf && <div className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />}
                  {l} {l !== 'all' && `(${counts[l]})`}
                </button>
              );
            })}
          </div>
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-gray-500 w-52"
            />
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-gray-400 font-sans font-semibold text-base mb-2">No Logs Yet</h3>
            <p className="text-gray-600 font-sans text-sm">System activity will appear here in real-time</p>
          </div>
        ) : (
          filtered.map(log => {
            const conf = LEVEL_CONFIG[log.level];
            return (
              <div key={log.id}
                className={`flex items-start gap-3 px-3 py-2 rounded-xl border transition-all hover:bg-gray-800/30
                  ${log.level === 'error' ? 'border-red-900/30 bg-red-950/20' :
                    log.level === 'warn' ? 'border-yellow-900/30 bg-yellow-950/10' :
                    log.level === 'success' ? 'border-green-900/20 bg-green-950/10' :
                    'border-transparent'}`}>
                {/* Timestamp */}
                <span className="text-gray-700 flex-shrink-0 w-20 text-right">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>

                {/* Level Badge */}
                <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold border ${conf.badge} ${conf.color} w-16 text-center`}>
                  {conf.label}
                </span>

                {/* Profile */}
                {log.profileName && (
                  <span className="text-purple-400 flex-shrink-0 max-w-[120px] truncate">
                    [{log.profileName}]
                  </span>
                )}

                {/* Message */}
                <span className={`flex-1 leading-relaxed ${
                  log.level === 'error' ? 'text-red-300' :
                  log.level === 'warn' ? 'text-yellow-300' :
                  log.level === 'success' ? 'text-green-300' :
                  'text-gray-300'}`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-gray-800 bg-gray-950/50 flex-shrink-0 text-xs text-gray-700 flex items-center gap-4">
        <span>📦 SQLite WAL: All logs persisted</span>
        <span>🔄 Auto-scroll: On</span>
        <span className="ml-auto">{filtered.length} entries shown</span>
      </div>
    </div>
  );
}
