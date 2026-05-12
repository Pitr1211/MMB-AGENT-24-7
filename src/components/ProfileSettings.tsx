import { X, Shield, Globe, Monitor, Fingerprint, Clock, RefreshCw } from 'lucide-react';
import type { Profile } from '../types';

interface ProfileSettingsProps {
  profile: Profile;
  onClose: () => void;
  onRenewProxy: (id: string) => void;
}

export default function ProfileSettings({ profile, onClose, onRenewProxy }: ProfileSettingsProps) {
  const timeLeft = profile.proxy.expiresAt - Date.now();
  const isExpired = timeLeft <= 0;
  const timeLeftStr = isExpired ? 'EXPIRED' : formatTime(timeLeft);

  function formatTime(ms: number) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
              ${profile.os === 'Windows' ? 'bg-blue-900/50 text-blue-400' :
                profile.os === 'Android' ? 'bg-green-900/50 text-green-400' :
                'bg-purple-900/50 text-purple-400'}`}>
              {profile.os === 'Windows' ? '🪟' : profile.os === 'Android' ? '🤖' : '🍎'}
            </div>
            <div>
              <h2 className="text-white font-bold">{profile.name}</h2>
              <p className="text-gray-500 text-xs">{profile.os} Profile Settings</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* Proxy Config */}
            <Section title="Proxy Configuration" icon={<Globe size={15} className="text-blue-400" />}>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Server" value={profile.proxy.server} />
                <InfoRow label="Port" value={String(profile.proxy.port)} />
                <InfoRow label="State" value={profile.proxy.state} />
                <InfoRow label="City" value={profile.proxy.city} />
                <InfoRow label="Life" value={profile.proxy.life} />
                <InfoRow label="Session ID" value={profile.proxy.sessionId} mono />
                <InfoRow label="Time Left" value={timeLeftStr} highlight={isExpired ? 'red' : 'green'} />
                <InfoRow label="Assigned" value={new Date(profile.proxy.assignedAt).toLocaleTimeString()} />
              </div>
              <div className="mt-3 p-3 bg-gray-800 rounded-xl">
                <div className="text-gray-400 text-xs mb-1 font-medium">Username</div>
                <div className="text-green-400 text-xs font-mono break-all leading-relaxed">{profile.proxy.username}</div>
              </div>
              <div className="mt-3 p-3 bg-gray-800 rounded-xl">
                <div className="text-gray-400 text-xs mb-1 font-medium">Password</div>
                <div className="text-gray-300 text-xs font-mono">{profile.proxy.password}</div>
              </div>
              <button
                onClick={() => onRenewProxy(profile.id)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-all text-sm font-medium">
                <RefreshCw size={14} />
                Renew Proxy Session
              </button>
            </Section>

            {/* Fingerprint */}
            <Section title="Fingerprint Config" icon={<Fingerprint size={15} className="text-purple-400" />}>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Timezone" value={profile.fingerprint.timezone} />
                <InfoRow label="Language" value={profile.fingerprint.language} />
                <InfoRow label="Resolution" value={profile.fingerprint.resolution} />
                <InfoRow label="WebGL/GPU" value={profile.fingerprint.webGL} />
                <InfoRow label="CPU Cores" value={`${profile.fingerprint.cpu} cores`} />
                <InfoRow label="RAM" value={`${profile.fingerprint.ram} GB`} />
                <InfoRow label="Canvas" value="Noise Mode" highlight="green" />
                <InfoRow label="Audio Context" value="Noise Mode" highlight="green" />
                <InfoRow label="WebRTC" value={profile.fingerprint.webRTC} highlight="green" />
                <InfoRow label="Battery" value={`${profile.fingerprint.battery}%`} />
                {profile.fingerprint.deviceModel && (
                  <InfoRow label="Device Model" value={profile.fingerprint.deviceModel} />
                )}
                {profile.fingerprint.androidVersion && (
                  <InfoRow label="Android Version" value={profile.fingerprint.androidVersion} />
                )}
                {profile.fingerprint.macOsVersion && (
                  <InfoRow label="macOS Version" value={profile.fingerprint.macOsVersion} />
                )}
              </div>
              <div className="mt-3 p-3 bg-gray-800 rounded-xl">
                <div className="text-gray-400 text-xs mb-1 font-medium">User Agent</div>
                <div className="text-gray-300 text-xs font-mono break-all leading-relaxed">{profile.fingerprint.userAgent}</div>
              </div>
            </Section>

            {/* Fingerprint Tiers */}
            <Section title="Fingerprint Tier Status" icon={<Shield size={15} className="text-green-400" />}>
              <div className="space-y-2">
                <TierRow tier="TIER 1 — Must Unique" items={['IP ✓', 'Cookies ✓', 'UA ✓', 'Timezone ✓', 'WebRTC ✓', 'Canvas ✓', 'WebGL ✓', 'Fonts ✓']} color="red" />
                <TierRow tier="TIER 2 — Important" items={['Audio ✓', 'CPU ✓', 'RAM ✓', 'Resolution ✓', 'Language ✓', 'Geolocation ✓']} color="yellow" />
                <TierRow tier="TIER 3 — Good to Have" items={['Battery ✓', 'Speech ✓', 'Media Devices ✓']} color="blue" />
              </div>
            </Section>

            {/* System Info */}
            <Section title="System Info" icon={<Monitor size={15} className="text-gray-400" />}>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Profile ID" value={profile.id} mono />
                <InfoRow label="Env ID" value={profile.envId || 'N/A'} mono />
                <InfoRow label="Status" value={profile.status} highlight={profile.status === 'running' ? 'green' : profile.status === 'error' ? 'red' : 'yellow'} />
                <InfoRow label="Created" value={new Date(profile.createdAt).toLocaleString()} />
                {profile.ip && <InfoRow label="Current IP" value={profile.ip} highlight="green" />}
                <InfoRow label="Current Action" value={profile.currentAction} />
              </div>
            </Section>

            {/* Geolocation */}
            <Section title="Geolocation" icon={<Clock size={15} className="text-yellow-400" />}>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Latitude" value={profile.fingerprint.geolocation.lat.toFixed(4)} />
                <InfoRow label="Longitude" value={profile.fingerprint.geolocation.lng.toFixed(4)} />
                <InfoRow label="State" value={profile.proxy.state} />
                <InfoRow label="City" value={profile.proxy.city} />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
      <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono = false, highlight }: {
  label: string; value: string; mono?: boolean; highlight?: 'green' | 'red' | 'yellow';
}) {
  const colorMap = {
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
  };
  return (
    <div className="bg-gray-900/60 rounded-lg px-3 py-2">
      <div className="text-gray-500 text-xs">{label}</div>
      <div className={`text-xs mt-0.5 font-medium ${mono ? 'font-mono' : ''} ${highlight ? colorMap[highlight] : 'text-gray-200'}`}>
        {value}
      </div>
    </div>
  );
}

function TierRow({ tier, items, color }: { tier: string; items: string[]; color: 'red' | 'yellow' | 'blue' }) {
  const colorMap = {
    red: 'border-red-500/30 bg-red-900/10 text-red-300',
    yellow: 'border-yellow-500/30 bg-yellow-900/10 text-yellow-300',
    blue: 'border-blue-500/30 bg-blue-900/10 text-blue-300',
  };
  const labelColor = { red: 'text-red-400', yellow: 'text-yellow-400', blue: 'text-blue-400' };
  return (
    <div className={`border rounded-xl p-3 ${colorMap[color]}`}>
      <div className={`text-xs font-bold mb-2 ${labelColor[color]}`}>{tier}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span key={item} className="text-xs bg-black/30 px-2 py-0.5 rounded-full">{item}</span>
        ))}
      </div>
    </div>
  );
}
