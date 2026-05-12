import { useState, useCallback } from 'react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💾 SQLITE TABLE SCHEMAS (simulated in React state)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// CREATE TABLE IF NOT EXISTS channels (
//   id              INTEGER PRIMARY KEY AUTOINCREMENT,
//   channel_id      TEXT UNIQUE NOT NULL,
//   channel_name    TEXT,
//   channel_handle  TEXT,
//   channel_url     TEXT,
//   subscriber_count INTEGER DEFAULT 0,
//   status          TEXT DEFAULT 'active',
//   auto_sync       TEXT DEFAULT '6hr',
//   last_sync       DATETIME,
//   total_videos    INTEGER DEFAULT 0,
//   created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
// );
//
// CREATE TABLE IF NOT EXISTS videos (
//   id              INTEGER PRIMARY KEY AUTOINCREMENT,
//   channel_id      INTEGER NOT NULL
//                   REFERENCES channels(id) ON DELETE CASCADE,
//   video_id        TEXT UNIQUE NOT NULL,
//   title           TEXT NOT NULL,
//   url             TEXT NOT NULL,
//   duration        INTEGER DEFAULT 0,
//   views           INTEGER DEFAULT 0,
//   upload_date     DATETIME,
//   is_enabled      INTEGER DEFAULT 1,
//   is_new          INTEGER DEFAULT 1,
//   watch_count     INTEGER DEFAULT 0,
//   last_watched    DATETIME,
//   status          TEXT DEFAULT 'available',
//   created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
// );
//
// CREATE TABLE IF NOT EXISTS playlists (
//   id              INTEGER PRIMARY KEY AUTOINCREMENT,
//   channel_id      INTEGER NOT NULL
//                   REFERENCES channels(id) ON DELETE CASCADE,
//   playlist_id     TEXT UNIQUE NOT NULL,
//   playlist_name   TEXT,
//   video_count     INTEGER DEFAULT 0,
//   status          TEXT DEFAULT 'active',
//   created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
// );
//
// INDEXES:
// CREATE INDEX IF NOT EXISTS idx_videos_channel ON videos(channel_id);
// CREATE INDEX IF NOT EXISTS idx_videos_enabled ON videos(is_enabled);
// CREATE INDEX IF NOT EXISTS idx_videos_new ON videos(is_new);
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ChannelStatus = 'active' | 'inactive' | 'syncing';
export type AutoSync = '1hr' | '6hr' | '12hr' | 'daily' | 'manual';
export type VideoStatus = 'available' | 'queued' | 'running' | 'done';
export type PlaylistStatus = 'active' | 'inactive';

export interface Channel {
  id: number;
  channel_id: string;
  channel_name: string;
  channel_handle: string;
  channel_url: string;
  subscriber_count: number;
  status: ChannelStatus;
  auto_sync: AutoSync;
  last_sync: number | null;
  total_videos: number;
  created_at: number;
}

export interface Video {
  id: number;
  channel_id: number; // FK → channels.id
  video_id: string;
  title: string;
  url: string;
  duration: number; // seconds
  views: number;
  upload_date: number; // timestamp
  is_enabled: number; // 0 | 1
  is_new: number; // 0 | 1
  watch_count: number;
  last_watched: number | null;
  status: VideoStatus;
  created_at: number;
}

export interface Playlist {
  id: number;
  channel_id: number; // FK → channels.id
  playlist_id: string;
  playlist_name: string;
  video_count: number;
  status: PlaylistStatus;
  created_at: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎭 MOCK DATA GENERATORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function nanoid(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): number {
  const now = Date.now();
  return now - randomInt(0, daysBack * 24 * 60 * 60 * 1000);
}

const VIDEO_TITLES = [
  'Python Tutorial for Beginners',
  'JavaScript Crash Course',
  'React Hooks Explained',
  'Node.js REST API Tutorial',
  'TypeScript Full Course',
  'CSS Grid Layout Guide',
  'Docker for Developers',
  'Git & GitHub Essentials',
  'Machine Learning Basics',
  'Web Scraping with Python',
  'Flutter App Development',
  'Rust Programming Introduction',
  'AWS Cloud Fundamentals',
  'Vue.js 3 Composition API',
  'GraphQL Complete Guide',
  'Kubernetes Deployment',
  'Firebase Authentication',
  'Next.js 14 New Features',
  'Tailwind CSS Tips & Tricks',
  'MongoDB Full Tutorial',
  'Go Lang for Beginners',
  'Redis Caching Strategy',
  'System Design Interview',
  'Data Structures & Algorithms',
  'Clean Code Principles',
];

let autoIncrement = { channel: 0, video: 0, playlist: 0 };

function generateMockVideos(channelDbId: number, count: number): Video[] {
  const videos: Video[] = [];
  for (let i = 0; i < count; i++) {
    autoIncrement.video++;
    const videoId = 'video_' + nanoid(8);
    const titleIndex = i % VIDEO_TITLES.length;
    videos.push({
      id: autoIncrement.video,
      channel_id: channelDbId,
      video_id: videoId,
      title: `${VIDEO_TITLES[titleIndex]} #${i + 1}`,
      url: `https://youtube.com/watch?v=${videoId}`,
      duration: randomInt(300, 7200),
      views: randomInt(1000, 5000000),
      upload_date: randomDate(730), // within last 2 years
      is_enabled: 1,
      is_new: i < 3 ? 1 : 0, // first 3 are new
      watch_count: i < 3 ? 0 : randomInt(0, 8),
      last_watched: i < 3 ? null : (randomInt(0, 8) > 0 ? randomDate(30) : null),
      status: 'available',
      created_at: Date.now(),
    });
  }
  return videos;
}

function generateMockPlaylists(channelDbId: number): Playlist[] {
  autoIncrement.playlist++;
  const p1: Playlist = {
    id: autoIncrement.playlist,
    channel_id: channelDbId,
    playlist_id: 'PL' + nanoid(16),
    playlist_name: 'Python Tutorials',
    video_count: 45,
    status: 'active',
    created_at: Date.now(),
  };
  autoIncrement.playlist++;
  const p2: Playlist = {
    id: autoIncrement.playlist,
    channel_id: channelDbId,
    playlist_id: 'PL' + nanoid(16),
    playlist_name: 'Old Content',
    video_count: 23,
    status: 'inactive',
    created_at: Date.now(),
  };
  return [p1, p2];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Preload 2 mock channels
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function createInitialData(): { channels: Channel[]; videos: Video[]; playlists: Playlist[] } {
  const channels: Channel[] = [];
  const videos: Video[] = [];
  const playlists: Playlist[] = [];

  // Channel 1: TechWithTim
  autoIncrement.channel++;
  const ch1: Channel = {
    id: autoIncrement.channel,
    channel_id: 'UCW5YeuERMmlnqo4oq8vwUpg',
    channel_name: 'TechWithTim',
    channel_handle: '@techwithim',
    channel_url: 'https://youtube.com/@techwithim',
    subscriber_count: 2300000,
    status: 'active',
    auto_sync: '6hr',
    last_sync: Date.now() - 5 * 60 * 1000, // 5 min ago
    total_videos: 18,
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000,
  };
  channels.push(ch1);

  const ch1Videos = generateMockVideos(ch1.id, 18);
  videos.push(...ch1Videos);

  const ch1Playlists = generateMockPlaylists(ch1.id);
  playlists.push(...ch1Playlists);

  // Channel 2: Fireship
  autoIncrement.channel++;
  const ch2: Channel = {
    id: autoIncrement.channel,
    channel_id: 'UCsBjURrj4Tl3dJahgq6H21A',
    channel_name: 'Fireship',
    channel_handle: '@fireship',
    channel_url: 'https://youtube.com/@fireship',
    subscriber_count: 2100000,
    status: 'active',
    auto_sync: '6hr',
    last_sync: Date.now() - 15 * 60 * 1000, // 15 min ago
    total_videos: 16,
    created_at: Date.now() - 45 * 24 * 60 * 60 * 1000,
  };
  channels.push(ch2);

  const ch2Videos = generateMockVideos(ch2.id, 16);
  videos.push(...ch2Videos);

  const ch2Playlists = generateMockPlaylists(ch2.id);
  playlists.push(...ch2Playlists);

  return { channels, videos, playlists };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔌 CHANNEL STORE HOOK (simulates Express API + SQLite)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useChannelStore() {
  const [data] = useState(() => createInitialData());
  const [channels, setChannels] = useState<Channel[]>(data.channels);
  const [videos, setVideos] = useState<Video[]>(data.videos);
  const [playlists, setPlaylists] = useState<Playlist[]>(data.playlists);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  // Toast helper
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = nanoid(6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── GET /api/channels ───
  const getChannels = useCallback(() => {
    return channels.map(ch => ({
      ...ch,
      total_videos: videos.filter(v => v.channel_id === ch.id).length,
      enabled_videos: videos.filter(v => v.channel_id === ch.id && v.is_enabled === 1).length,
      new_videos: videos.filter(v => v.channel_id === ch.id && v.is_new === 1).length,
    }));
  }, [channels, videos]);

  // ─── POST /api/channels ───
  const addChannel = useCallback((channelId: string, autoSync: AutoSync, status: ChannelStatus) => {
    // Check UNIQUE constraint
    if (channels.find(c => c.channel_id === channelId)) {
      addToast('Channel already exists!', 'error');
      return null;
    }

    autoIncrement.channel++;
    const newChannel: Channel = {
      id: autoIncrement.channel,
      channel_id: channelId,
      channel_name: 'Channel_' + nanoid(5),
      channel_handle: '@channel_' + nanoid(5).toLowerCase(),
      channel_url: `https://youtube.com/channel/${channelId}`,
      subscriber_count: randomInt(10000, 3000000),
      status,
      auto_sync: autoSync,
      last_sync: Date.now(),
      total_videos: 0,
      created_at: Date.now(),
    };

    // Generate 15-20 mock videos
    const videoCount = randomInt(15, 20);
    const newVideos = generateMockVideos(newChannel.id, videoCount);
    newChannel.total_videos = videoCount;

    setChannels(prev => [...prev, newChannel]);
    setVideos(prev => [...prev, ...newVideos]);

    // Generate default playlists
    const newPlaylists = generateMockPlaylists(newChannel.id);
    setPlaylists(prev => [...prev, ...newPlaylists]);

    addToast(`Channel added successfully! ${videoCount} videos found.`, 'success');
    return newChannel;
  }, [channels, addToast]);

  // ─── PUT /api/channels/:id ───
  const updateChannel = useCallback((id: number, updates: Partial<Pick<Channel, 'auto_sync' | 'status' | 'channel_name'>>) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, ...updates } : ch));
    addToast('Channel updated successfully!', 'success');
  }, [addToast]);

  // ─── DELETE /api/channels/:id (CASCADE) ───
  const deleteChannel = useCallback((id: number) => {
    setChannels(prev => prev.filter(ch => ch.id !== id));
    // CASCADE delete videos
    setVideos(prev => prev.filter(v => v.channel_id !== id));
    // CASCADE delete playlists
    setPlaylists(prev => prev.filter(p => p.channel_id !== id));
    addToast('Channel deleted successfully!', 'success');
  }, [addToast]);

  // ─── POST /api/channels/:id/sync ───
  const syncChannel = useCallback((id: number) => {
    // Set status to syncing
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, status: 'syncing' as ChannelStatus } : ch));

    // Simulate async sync
    setTimeout(() => {
      // Add 2 new mock videos (INSERT OR IGNORE via unique video_id)
      const newVideos = generateMockVideos(id, 2).map(v => ({ ...v, is_new: 1 as number, watch_count: 0 }));
      setVideos(prev => [...newVideos, ...prev]);

      // Update channel
      setChannels(prev => prev.map(ch => ch.id === id ? {
        ...ch,
        status: 'active' as ChannelStatus,
        last_sync: Date.now(),
        total_videos: ch.total_videos + 2,
      } : ch));

      addToast('Synced! 2 new videos found', 'success');
    }, 2000);
  }, [addToast]);

  // ─── POST /api/channels/sync-all ───
  const syncAllChannels = useCallback(() => {
    const activeChannels = channels.filter(ch => ch.status === 'active');
    activeChannels.forEach(ch => syncChannel(ch.id));
  }, [channels, syncChannel]);

  // ─── PATCH /api/channels/:id/toggle ───
  const toggleChannel = useCallback((id: number) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id !== id) return ch;
      const newStatus: ChannelStatus = ch.status === 'active' ? 'inactive' : 'active';
      return { ...ch, status: newStatus };
    }));
  }, []);

  // ─── Enable/Disable all channels ───
  const enableAllChannels = useCallback(() => {
    setChannels(prev => prev.map(ch => ({ ...ch, status: 'active' as ChannelStatus })));
    addToast('All channels enabled!', 'success');
  }, [addToast]);

  const disableAllChannels = useCallback(() => {
    setChannels(prev => prev.map(ch => ({ ...ch, status: 'inactive' as ChannelStatus })));
    addToast('All channels disabled!', 'info');
  }, [addToast]);

  // ─── GET /api/channels/:id/videos ───
  const getVideos = useCallback((channelId: number, filter?: string, sort?: string, search?: string) => {
    let result = videos.filter(v => v.channel_id === channelId);

    // Filter
    if (filter === 'enabled') result = result.filter(v => v.is_enabled === 1);
    else if (filter === 'disabled') result = result.filter(v => v.is_enabled === 0);
    else if (filter === 'new') result = result.filter(v => v.is_new === 1);
    else if (filter === 'watched') result = result.filter(v => v.watch_count > 0);
    else if (filter === 'unwatched') result = result.filter(v => v.watch_count === 0);

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(v => v.title.toLowerCase().includes(s));
    }

    // Sort
    if (sort === 'newest') result = [...result].sort((a, b) => b.upload_date - a.upload_date);
    else if (sort === 'oldest') result = [...result].sort((a, b) => a.upload_date - b.upload_date);
    else if (sort === 'views') result = [...result].sort((a, b) => b.views - a.views);
    else if (sort === 'duration') result = [...result].sort((a, b) => b.duration - a.duration);
    else result = [...result].sort((a, b) => b.upload_date - a.upload_date); // default newest

    return result;
  }, [videos]);

  // ─── PATCH /api/videos/:id/toggle ───
  const toggleVideo = useCallback((videoId: number) => {
    setVideos(prev => prev.map(v => {
      if (v.id !== videoId) return v;
      return { ...v, is_enabled: v.is_enabled === 1 ? 0 : 1 };
    }));
  }, []);

  // ─── POST /api/channels/:id/videos/enable-all ───
  const enableAllVideos = useCallback((channelId: number) => {
    setVideos(prev => prev.map(v => v.channel_id === channelId ? { ...v, is_enabled: 1 } : v));
    addToast('All videos enabled!', 'success');
  }, [addToast]);

  // ─── POST /api/channels/:id/videos/disable-all ───
  const disableAllVideos = useCallback((channelId: number) => {
    setVideos(prev => prev.map(v => v.channel_id === channelId ? { ...v, is_enabled: 0 } : v));
    addToast('All videos disabled!', 'info');
  }, [addToast]);

  // ─── GET /api/channels/:id/playlists ───
  const getPlaylists = useCallback((channelId: number) => {
    return playlists.filter(p => p.channel_id === channelId);
  }, [playlists]);

  // ─── POST /api/channels/:id/playlists ───
  const addPlaylist = useCallback((channelId: number, playlistId: string, playlistName: string) => {
    if (playlists.find(p => p.playlist_id === playlistId)) {
      addToast('Playlist already exists!', 'error');
      return;
    }
    autoIncrement.playlist++;
    const newPlaylist: Playlist = {
      id: autoIncrement.playlist,
      channel_id: channelId,
      playlist_id: playlistId,
      playlist_name: playlistName || 'Playlist ' + nanoid(4),
      video_count: randomInt(5, 50),
      status: 'active',
      created_at: Date.now(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    addToast('Playlist added!', 'success');
  }, [playlists, addToast]);

  // ─── DELETE /api/playlists/:id ───
  const deletePlaylist = useCallback((id: number) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    addToast('Playlist removed!', 'success');
  }, [addToast]);

  // ─── PATCH /api/playlists/:id/toggle ───
  const togglePlaylist = useCallback((id: number) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, status: p.status === 'active' ? 'inactive' as PlaylistStatus : 'active' as PlaylistStatus };
    }));
  }, []);

  return {
    channels,
    videos,
    playlists,
    toasts,
    dismissToast,
    getChannels,
    addChannel,
    updateChannel,
    deleteChannel,
    syncChannel,
    syncAllChannels,
    toggleChannel,
    enableAllChannels,
    disableAllChannels,
    getVideos,
    toggleVideo,
    enableAllVideos,
    disableAllVideos,
    getPlaylists,
    addPlaylist,
    deletePlaylist,
    togglePlaylist,
  };
}
