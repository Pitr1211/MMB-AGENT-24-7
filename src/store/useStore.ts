import { useState, useCallback } from 'react';
import type { Profile, Job, LogEntry, OS, TaskType } from '../types';
import {
  generateProxyConfig, generateFingerprint, generateFakeIPForProxy, generateProfileName, renewProxySession
} from '../utils/generators';

let profileCounter = 0;
let jobCounter = 0;

function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const TASK_LABELS: Record<TaskType, string> = {
  watch_video: 'Watching video',
  like_video: 'Liking video',
  subscribe: 'Subscribing to channel',
  comment: 'Posting comment',
  search: 'Searching YouTube',
  idle: 'Idle',
};

export function useStore() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const addLog = useCallback((
    level: LogEntry['level'],
    message: string,
    profileId?: string,
    profileName?: string
  ) => {
    const entry: LogEntry = {
      id: genId(),
      profileId,
      profileName,
      level,
      message,
      timestamp: Date.now(),
    };
    setLogs(prev => [entry, ...prev].slice(0, 500));
  }, []);

  const createProfile = useCallback((os: OS) => {
    profileCounter++;
    const proxy = generateProxyConfig();
    const fingerprint = generateFingerprint(os, proxy);
    const name = generateProfileName(os, profileCounter);
    const newProfile: Profile = {
      id: genId(),
      name,
      os,
      status: 'stopped',
      proxy,
      fingerprint,
      currentAction: 'Idle',
      createdAt: Date.now(),
      selected: false,
      envId: `env_${genId()}`,
    };
    setProfiles(prev => [...prev, newProfile]);
    addLog('success', `Profile "${name}" created [${os}] | Proxy: ${proxy.state}, ${proxy.city} | Session: ${proxy.sessionId}`, newProfile.id, name);
    return newProfile;
  }, [addLog]);

  const startProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== profileId) return p;
      const now = Date.now();
      let proxy = p.proxy;
      if (now > proxy.expiresAt) {
        proxy = renewProxySession(proxy);
        addLog('warn', `Proxy session expired — renewed for "${p.name}" | New session: ${proxy.sessionId}`, p.id, p.name);
      }
      const ip = generateFakeIPForProxy(proxy);
      addLog('info', `Starting profile "${p.name}" — connecting to MoreLogin browser...`, p.id, p.name);
      setTimeout(() => {
        setProfiles(prev2 => prev2.map(p2 => p2.id === profileId ? { ...p2, status: 'running', ip } : p2));
        addLog('success', `Profile "${p.name}" LIVE — IP: ${ip} | ${proxy.city}, ${proxy.state}`, p.id, p.name);
      }, randomDelay(5000, 15000));
      return { ...p, status: 'starting', proxy, ip: undefined, currentAction: 'Connecting...' };
    }));
  }, [addLog]);

  const stopProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== profileId) return p;
      addLog('info', `Stopping profile "${p.name}"`, p.id, p.name);
      return { ...p, status: 'stopped', ip: undefined, currentAction: 'Idle' };
    }));
    setJobs(prev => prev.map(j => j.profileId === profileId && j.status === 'running'
      ? { ...j, status: 'failed', completedAt: Date.now() } : j
    ));
  }, [addLog]);

  const deleteProfile = useCallback((profileId: string) => {
    const p = profiles.find(x => x.id === profileId);
    if (p) addLog('warn', `Profile "${p.name}" deleted`, p.id, p.name);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    setJobs(prev => prev.filter(j => j.profileId !== profileId));
  }, [profiles, addLog]);

  const recreateProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== profileId) return p;
      const newProxy = generateProxyConfig();
      const newFingerprint = generateFingerprint(p.os, newProxy);
      addLog('info', `Recreating profile "${p.name}" with new proxy + fingerprint`, p.id, p.name);
      return {
        ...p,
        status: 'stopped',
        proxy: newProxy,
        fingerprint: newFingerprint,
        ip: undefined,
        currentAction: 'Idle',
      };
    }));
  }, [addLog]);

  const toggleSelect = useCallback((profileId: string) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, selected: !p.selected } : p));
  }, []);

  const selectAll = useCallback(() => {
    setProfiles(prev => prev.map(p => ({ ...p, selected: true })));
  }, []);

  const deselectAll = useCallback(() => {
    setProfiles(prev => prev.map(p => ({ ...p, selected: false })));
  }, []);

  const startSelected = useCallback(() => {
    profiles.filter(p => p.selected && p.status === 'stopped').forEach(p => startProfile(p.id));
  }, [profiles, startProfile]);

  const stopSelected = useCallback(() => {
    profiles.filter(p => p.selected && (p.status === 'running' || p.status === 'starting')).forEach(p => stopProfile(p.id));
  }, [profiles, stopProfile]);

  const addJob = useCallback((profileId: string, taskType: TaskType, details?: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    jobCounter++;
    const job: Job = {
      id: genId(),
      profileId,
      profileName: profile.name,
      taskType,
      status: 'pending',
      retryCount: 0,
      createdAt: Date.now(),
      details,
    };
    setJobs(prev => [job, ...prev]);
    addLog('info', `Job queued: [${taskType}] for "${profile.name}"`, profileId, profile.name);

    // Simulate job execution
    setTimeout(() => {
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'running', startedAt: Date.now() } : j));
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, currentAction: TASK_LABELS[taskType] } : p));

      setTimeout(() => {
        const success = Math.random() > 0.1;
        setJobs(prev => prev.map(j => j.id === job.id
          ? { ...j, status: success ? 'done' : 'failed', completedAt: Date.now() }
          : j
        ));
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, currentAction: 'Idle' } : p));
        addLog(
          success ? 'success' : 'error',
          `Job [${taskType}] for "${profile.name}" — ${success ? 'COMPLETED' : 'FAILED'}`,
          profileId,
          profile.name
        );
      }, randomDelay(3000, 10000));
    }, randomDelay(500, 2000));
  }, [profiles, addLog]);

  const retryJob = useCallback((jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId
      ? { ...j, status: 'pending', retryCount: j.retryCount + 1, completedAt: undefined }
      : j
    ));
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const renewProxy = useCallback((profileId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== profileId) return p;
      const newProxy = renewProxySession(p.proxy);
      addLog('success', `Proxy renewed for "${p.name}" | New session: ${newProxy.sessionId}`, p.id, p.name);
      return { ...p, proxy: newProxy };
    }));
  }, [addLog]);

  return {
    profiles, jobs, logs, activeTab, setActiveTab,
    createProfile, startProfile, stopProfile, deleteProfile, recreateProfile,
    toggleSelect, selectAll, deselectAll, startSelected, stopSelected,
    addJob, retryJob, clearLogs, renewProxy,
  };
}

function randomDelay(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
