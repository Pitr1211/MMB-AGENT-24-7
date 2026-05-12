import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import ProfilesPage from './components/ProfilesPage';
import ChannelsPage from './components/ChannelsPage';
import JobQueuePage from './components/JobQueuePage';
import ProxyManagerPage from './components/ProxyManagerPage';
import LogsPage from './components/LogsPage';
import SettingsPage from './components/SettingsPage';
import { useStore } from './store/useStore';
import { useChannelStore } from './store/useChannelStore';
import type { OS, TaskType } from './types';

export default function App() {
  const {
    profiles, jobs, logs, activeTab, setActiveTab,
    createProfile, startProfile, stopProfile, deleteProfile, recreateProfile,
    toggleSelect, selectAll, deselectAll, startSelected, stopSelected,
    addJob, retryJob, clearLogs, renewProxy,
  } = useStore();

  const channelStore = useChannelStore();
  const activeChannelsCount = channelStore.channels.filter(ch => ch.status === 'active').length;

  const runningCount = profiles.filter(p => p.status === 'running').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;

  // Check proxy expiry every 10 minutes (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app this would trigger proxy renewal checks
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard profiles={profiles} jobs={jobs} setActiveTab={setActiveTab} />;
      case 'profiles':
        return (
          <ProfilesPage
            profiles={profiles}
            onCreateProfile={(os: OS) => createProfile(os)}
            onStartProfile={startProfile}
            onStopProfile={stopProfile}
            onDeleteProfile={deleteProfile}
            onRecreateProfile={recreateProfile}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onStartSelected={startSelected}
            onStopSelected={stopSelected}
            onRenewProxy={renewProxy}
            onAddJob={(profileId: string, taskType: TaskType, details?: string) => addJob(profileId, taskType, details)}
          />
        );
      case 'channels':
        return (
          <ChannelsPage
            channels={channelStore.channels}
            getChannels={channelStore.getChannels}
            addChannel={channelStore.addChannel}
            updateChannel={channelStore.updateChannel}
            deleteChannel={channelStore.deleteChannel}
            syncChannel={channelStore.syncChannel}
            syncAllChannels={channelStore.syncAllChannels}
            toggleChannel={channelStore.toggleChannel}
            enableAllChannels={channelStore.enableAllChannels}
            disableAllChannels={channelStore.disableAllChannels}
            getVideos={channelStore.getVideos}
            toggleVideo={channelStore.toggleVideo}
            enableAllVideos={channelStore.enableAllVideos}
            disableAllVideos={channelStore.disableAllVideos}
            getPlaylists={channelStore.getPlaylists}
            addPlaylist={channelStore.addPlaylist}
            deletePlaylist={channelStore.deletePlaylist}
            togglePlaylist={channelStore.togglePlaylist}
            toasts={channelStore.toasts}
            dismissToast={channelStore.dismissToast}
          />
        );
      case 'jobs':
        return <JobQueuePage jobs={jobs} onRetry={retryJob} />;
      case 'proxy':
        return <ProxyManagerPage profiles={profiles} onRenewProxy={renewProxy} />;
      case 'logs':
        return <LogsPage logs={logs} onClear={clearLogs} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard profiles={profiles} jobs={jobs} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        runningCount={runningCount}
        pendingJobs={pendingJobs}
        activeChannels={activeChannelsCount}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        <TopBar profiles={profiles} logs={logs} activeTab={activeTab} />
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
