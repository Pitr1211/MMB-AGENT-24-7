import { useState } from 'react';
import { Plus, CheckSquare, Square, Play, StopCircle, Search, Zap } from 'lucide-react';
import type { Profile, OS, TaskType } from '../types';
import ProfileCard from './ProfileCard';
import NewProfileModal from './NewProfileModal';
import ProfileSettings from './ProfileSettings';
import AddJobModal from './AddJobModal';

interface ProfilesPageProps {
  profiles: Profile[];

  onCreateProfile: (os: OS) => void;
  onStartProfile: (id: string) => void;
  onStopProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onRecreateProfile: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onStartSelected: () => void;
  onStopSelected: () => void;
  onRenewProxy: (id: string) => void;
  onAddJob: (profileId: string, taskType: TaskType, details?: string) => void;
}

export default function ProfilesPage({
  profiles,
  onCreateProfile, onStartProfile, onStopProfile, onDeleteProfile,
  onRecreateProfile, onToggleSelect, onSelectAll, onDeselectAll,
  onStartSelected, onStopSelected, onRenewProxy, onAddJob,
}: ProfilesPageProps) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [settingsProfileId, setSettingsProfileId] = useState<string | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [search, setSearch] = useState('');
  const [filterOS, setFilterOS] = useState<'All' | OS>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');


  const selectedCount = profiles.filter(p => p.selected).length;
  const runningCount = profiles.filter(p => p.status === 'running').length;
  const settingsProfile = settingsProfileId ? profiles.find(p => p.id === settingsProfileId) || null : null;

  const filtered = profiles.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.ip?.includes(search)) return false;
    if (filterOS !== 'All' && p.os !== filterOS) return false;
    if (filterStatus !== 'All' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Profiles</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {profiles.length} total • {runningCount} running • {selectedCount} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddJob(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/30 transition-all text-sm font-medium">
              <Zap size={15} />
              Add Job
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all text-sm font-semibold shadow-lg shadow-red-900/30">
              <Plus size={15} />
              New Profile
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all text-xs font-medium">
            <CheckSquare size={13} />
            Select All
          </button>
          <button onClick={onDeselectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-all text-xs font-medium">
            <Square size={13} />
            Deselect All
          </button>
          <button
            onClick={onStartSelected}
            disabled={selectedCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-900/30 border border-green-700/40 text-green-400 hover:bg-green-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-medium">
            <Play size={13} />
            Start Selected ({selectedCount})
          </button>
          <button
            onClick={onStopSelected}
            disabled={selectedCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-900/30 border border-red-700/40 text-red-400 hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-medium">
            <StopCircle size={13} />
            Stop Selected ({selectedCount})
          </button>

          <div className="w-px h-5 bg-gray-700 mx-1" />

          {/* OS Filter */}
          {(['All', 'Windows', 'Android', 'macOS'] as const).map(os => (
            <button key={os} onClick={() => setFilterOS(os)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all
                ${filterOS === os
                  ? 'bg-red-600/20 border-red-500/40 text-red-400'
                  : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>
              {os}
            </button>
          ))}

          <div className="w-px h-5 bg-gray-700 mx-1" />

          {/* Status Filter */}
          {(['All', 'running', 'stopped', 'starting', 'error'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all capitalize
                ${filterStatus === s
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search profiles by name or IP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-gray-500"
            />
          </div>
          <span className="text-gray-600 text-xs">{filtered.length} profiles shown</span>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-gray-400 font-semibold text-lg mb-2">
              {profiles.length === 0 ? 'No Profiles Yet' : 'No profiles match filters'}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {profiles.length === 0
                ? 'Click "New Profile" to create your first automated YouTube profile'
                : 'Try adjusting your search or filters'}
            </p>
            {profiles.length === 0 && (
              <button onClick={() => setShowNewModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">
                <Plus size={16} />
                Create First Profile
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onStart={onStartProfile}
                onStop={onStopProfile}
                onSettings={id => setSettingsProfileId(id)}
                onDelete={onDeleteProfile}
                onRecreate={onRecreateProfile}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewModal && (
        <NewProfileModal
          onClose={() => setShowNewModal(false)}
          onCreate={(os) => { onCreateProfile(os); setShowNewModal(false); }}
        />
      )}
      {settingsProfile && (
        <ProfileSettings
          profile={settingsProfile}
          onClose={() => setSettingsProfileId(null)}
          onRenewProxy={id => { onRenewProxy(id); }}
        />
      )}
      {showAddJob && (
        <AddJobModal
          profiles={profiles}
          onClose={() => setShowAddJob(false)}
          onAddJob={onAddJob}
        />
      )}
    </div>
  );
}
