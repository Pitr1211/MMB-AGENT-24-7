import { useState } from 'react';
import { RefreshCw, Clock, CheckCircle2, XCircle, Loader } from 'lucide-react';
import type { Job, JobStatus } from '../types';

interface JobQueuePageProps {
  jobs: Job[];
  onRetry: (jobId: string) => void;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; icon: React.ReactNode; color: string; badge: string }> = {
  pending: {
    label: 'Pending', icon: <Clock size={13} />,
    color: 'text-yellow-400', badge: 'bg-yellow-900/40 border-yellow-600/30 text-yellow-400'
  },
  running: {
    label: 'Running', icon: <Loader size={13} className="animate-spin" />,
    color: 'text-blue-400', badge: 'bg-blue-900/40 border-blue-600/30 text-blue-400'
  },
  done: {
    label: 'Done', icon: <CheckCircle2 size={13} />,
    color: 'text-green-400', badge: 'bg-green-900/40 border-green-600/30 text-green-400'
  },
  failed: {
    label: 'Failed', icon: <XCircle size={13} />,
    color: 'text-red-400', badge: 'bg-red-900/40 border-red-600/30 text-red-400'
  },
};

const TASK_ICONS: Record<string, string> = {
  watch_video: '▶️',
  like_video: '👍',
  subscribe: '🔔',
  comment: '💬',
  search: '🔍',
  idle: '💤',
};

export default function JobQueuePage({ jobs, onRetry }: JobQueuePageProps) {
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const counts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    running: jobs.filter(j => j.status === 'running').length,
    done: jobs.filter(j => j.status === 'done').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Queue</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              SQLite-based crash-safe job queue — {jobs.length} total jobs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm">
              <span className="text-gray-500">Retry on failure:</span>
              <span className="text-green-400 ml-2 font-medium">Enabled</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'running', 'done', 'failed'] as const).map(s => {
            const conf = s === 'all' ? null : STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all capitalize
                  ${filter === s
                    ? s === 'all' ? 'bg-gray-700 border-gray-600 text-white'
                      : conf!.badge
                    : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                {conf?.icon}
                {s} ({counts[s]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-gray-400 font-semibold text-lg mb-2">No Jobs Yet</h3>
            <p className="text-gray-600 text-sm">Jobs will appear here when you start automation tasks</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-600 text-xs font-medium uppercase tracking-wider">
              <div className="col-span-1">Task</div>
              <div className="col-span-3">Job ID</div>
              <div className="col-span-2">Profile</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Retry</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-1">Action</div>
            </div>

            {filtered.map(job => {
              const conf = STATUS_CONFIG[job.status];
              const duration = job.completedAt && job.startedAt
                ? ((job.completedAt - job.startedAt) / 1000).toFixed(1) + 's'
                : job.startedAt
                  ? ((Date.now() - job.startedAt) / 1000).toFixed(0) + 's'
                  : '—';

              return (
                <div key={job.id}
                  className="grid grid-cols-12 gap-4 items-center bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 transition-all">
                  {/* Task Icon */}
                  <div className="col-span-1 text-lg">
                    {TASK_ICONS[job.taskType] || '⚡'}
                  </div>

                  {/* Job ID */}
                  <div className="col-span-3">
                    <div className="text-gray-300 text-xs font-mono truncate">{job.id}</div>
                    <div className="text-gray-600 text-xs capitalize mt-0.5">
                      {job.taskType.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="col-span-2">
                    <div className="text-gray-300 text-xs truncate">{job.profileName}</div>
                    <div className="text-gray-600 text-xs font-mono truncate">{job.profileId.slice(0, 8)}...</div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${conf.badge}`}>
                      {conf.icon}
                      {conf.label}
                    </span>
                  </div>

                  {/* Retry Count */}
                  <div className="col-span-2">
                    <div className={`text-xs ${job.retryCount > 0 ? 'text-yellow-400' : 'text-gray-600'}`}>
                      {job.retryCount > 0 ? `⟳ ${job.retryCount} retries` : 'No retries'}
                    </div>
                    {job.details && (
                      <div className="text-gray-600 text-xs truncate mt-0.5">{job.details}</div>
                    )}
                  </div>

                  {/* Time */}
                  <div className="col-span-1">
                    <div className="text-gray-500 text-xs">{duration}</div>
                    <div className="text-gray-700 text-xs">
                      {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-1">
                    {job.status === 'failed' && (
                      <button onClick={() => onRetry(job.id)}
                        title="Retry Job"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-900/30 border border-yellow-700/30 text-yellow-400 hover:bg-yellow-900/50 transition-all">
                        <RefreshCw size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SQLite Info Footer */}
      <div className="px-6 py-3 border-t border-gray-800 bg-gray-950/50 flex-shrink-0">
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <span>💾 Storage: SQLite WAL Mode</span>
          <span>🔄 Crash Recovery: Automatic</span>
          <span>📊 Max Retries: 3</span>
          <span>⚡ Queue Processing: Real-time</span>
          <span className="ml-auto text-gray-700">jobs table — id, profile_id, task_type, status, retry_count, created_at</span>
        </div>
      </div>
    </div>
  );
}
