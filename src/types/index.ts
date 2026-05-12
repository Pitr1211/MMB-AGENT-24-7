export type OS = 'Windows' | 'Android' | 'macOS';
export type ProfileStatus = 'running' | 'stopped' | 'starting' | 'error' | 'recreating';
export type ProxyLife = '1hr' | '2hr' | '4hr' | '8hr' | '24hr';
export type JobStatus = 'pending' | 'running' | 'done' | 'failed';
export type TaskType = 'watch_video' | 'like_video' | 'subscribe' | 'comment' | 'search' | 'idle';

export interface ProxyConfig {
  server: string;
  port: number;
  username: string;
  password: string;
  state: string;
  city: string;
  life: ProxyLife;
  sessionId: string;
  assignedAt: number;
  expiresAt: number;
}

export interface Profile {
  id: string;
  name: string;
  os: OS;
  status: ProfileStatus;
  proxy: ProxyConfig;
  ip?: string;
  fingerprint: FingerprintConfig;
  currentAction: string;
  createdAt: number;
  selected: boolean;
  envId?: string;
}

export interface FingerprintConfig {
  userAgent: string;
  timezone: string;
  language: string;
  resolution: string;
  webGL: string;
  canvas: string;
  audioContext: string;
  cpu: number;
  ram: number;
  webRTC: string;
  geolocation: { lat: number; lng: number };
  battery: number;
  deviceModel?: string;
  androidVersion?: string;
  macOsVersion?: string;
}

export interface Job {
  id: string;
  profileId: string;
  profileName: string;
  taskType: TaskType;
  status: JobStatus;
  retryCount: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  details?: string;
}

export interface LogEntry {
  id: string;
  profileId?: string;
  profileName?: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: number;
}

export interface SystemStats {
  totalProfiles: number;
  runningProfiles: number;
  totalJobs: number;
  pendingJobs: number;
  completedJobs: number;
  failedJobs: number;
  activeProxies: number;
}
