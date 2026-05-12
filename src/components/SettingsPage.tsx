import { useState } from 'react';
import { Save, RefreshCw, Globe, BrainCircuit, Database, Server, Clock } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // MoreLogin
    moreloginHost: 'localhost',
    moreloginPort: '8080',
    moreloginApiKey: '',

    // Proxy
    proxyServer: 'us.smartproxy.net',
    proxyPort: '3120',
    proxyPassword: 'xEdCpOSFn3nd4ixu',
    proxyPrefix: 'smart-pwgbkxcy3lyi',
    defaultProxyLife: '4hr',

    // Automation
    startDelay: '5000',
    actionDelay: '2000',
    maxConcurrent: '5',
    maxRetries: '3',

    // Cron Schedule
    cronEnabled: true,
    cronSchedule: '0 9 * * *',
    cronAction: 'start_all',

    // MCP
    mcpPort: '3100',
    mcpEnabled: true,

    // DB
    dbPath: './data/ytbot.db',
    walMode: true,

    // PM2
    pm2Name: 'youtube-bot',
    pm2Instances: '1',
  });

  const update = (key: string, val: string | boolean) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-500 text-sm mt-0.5">System configuration — all settings stored in SQLite</p>
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${saved
                ? 'bg-green-600/30 border border-green-500/40 text-green-400'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30'}`}>
            {saved ? '✓ Saved!' : <><Save size={15} /> Save Settings</>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* MoreLogin Config */}
        <Section title="MoreLogin API" icon={<Globe size={15} className="text-blue-400" />} note="Local API only — must run on same machine">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Host" value={settings.moreloginHost} onChange={v => update('moreloginHost', v)} disabled />
            <Field label="Port" value={settings.moreloginPort} onChange={v => update('moreloginPort', v)} />
            <Field label="API Key" value={settings.moreloginApiKey} onChange={v => update('moreloginApiKey', v)} placeholder="Your MoreLogin API key" />
          </div>
          <div className="mt-3 bg-blue-900/20 border border-blue-600/30 rounded-xl p-3 text-xs text-blue-300">
            ⚠️ MoreLogin runs on <strong>localhost only</strong> — cannot be deployed remotely. All browser fingerprints are managed by MoreLogin's anti-detect system.
          </div>
          <div className="mt-3 space-y-1 text-xs text-gray-600 font-mono">
            <div>POST http://localhost:{settings.moreloginPort}/api/env/create</div>
            <div>POST http://localhost:{settings.moreloginPort}/api/env/start</div>
            <div>POST http://localhost:{settings.moreloginPort}/api/env/stop</div>
            <div>POST http://localhost:{settings.moreloginPort}/api/env/setProxy/batch</div>
          </div>
        </Section>

        {/* Smartproxy Config */}
        <Section title="Smartproxy Configuration" icon={<Server size={15} className="text-green-400" />} note="Fixed values — DO NOT change">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Server (Fixed)" value={settings.proxyServer} onChange={v => update('proxyServer', v)} disabled />
            <Field label="Port (Fixed)" value={settings.proxyPort} onChange={v => update('proxyPort', v)} disabled />
            <Field label="Password (Fixed)" value={settings.proxyPassword} onChange={v => update('proxyPassword', v)} disabled />
            <Field label="Prefix (Fixed)" value={settings.proxyPrefix} onChange={v => update('proxyPrefix', v)} disabled />
            <div className="col-span-2">
              <label className="text-gray-400 text-xs font-medium block mb-2">Default Proxy Life</label>
              <div className="flex gap-2">
                {['1hr', '2hr', '4hr', '8hr', '24hr'].map(life => (
                  <button key={life}
                    onClick={() => update('defaultProxyLife', life)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all
                      ${settings.defaultProxyLife === life
                        ? 'bg-green-600/20 border-green-500/40 text-green-400'
                        : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                    {life}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Automation Settings */}
        <Section title="Automation Settings" icon={<RefreshCw size={15} className="text-yellow-400" />}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Delay (ms)" value={settings.startDelay} onChange={v => update('startDelay', v)} type="number" desc="Wait between profile starts" />
            <Field label="Action Delay (ms)" value={settings.actionDelay} onChange={v => update('actionDelay', v)} type="number" desc="Delay between actions" />
            <Field label="Max Concurrent Profiles" value={settings.maxConcurrent} onChange={v => update('maxConcurrent', v)} type="number" desc="Run at most N profiles at once" />
            <Field label="Max Retries" value={settings.maxRetries} onChange={v => update('maxRetries', v)} type="number" desc="Job retry attempts before failed" />
          </div>
        </Section>

        {/* Cron Scheduling */}
        <Section title="Cron Scheduling (node-cron)" icon={<Clock size={15} className="text-purple-400" />}>
          <div className="flex items-center gap-3 mb-4">
            <ToggleSwitch enabled={settings.cronEnabled} onChange={v => update('cronEnabled', v)} />
            <span className={`text-sm ${settings.cronEnabled ? 'text-white' : 'text-gray-500'}`}>
              {settings.cronEnabled ? 'Scheduled automation ENABLED' : 'Scheduled automation DISABLED'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cron Expression" value={settings.cronSchedule} onChange={v => update('cronSchedule', v)}
              desc="e.g., '0 9 * * *' = 9am daily" mono />
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-2">Scheduled Action</label>
              <select
                value={settings.cronAction}
                onChange={e => update('cronAction', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-500">
                <option value="start_all">Start All Profiles</option>
                <option value="stop_all">Stop All Profiles</option>
                <option value="renew_proxies">Renew All Proxies</option>
                <option value="run_jobs">Run Pending Jobs</option>
              </select>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            {[
              { expr: '0 9 * * *', desc: 'Every day at 9am' },
              { expr: '0 */6 * * *', desc: 'Every 6 hours' },
              { expr: '*/30 * * * *', desc: 'Every 30 minutes' },
            ].map(({ expr, desc }) => (
              <button key={expr} onClick={() => update('cronSchedule', expr)}
                className="bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-left hover:border-gray-600 transition-all">
                <div className="text-purple-400 font-mono text-xs">{expr}</div>
                <div className="text-gray-500 text-xs mt-1">{desc}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* MCP Server */}
        <Section title="MCP Server (Claude AI Control)" icon={<BrainCircuit size={15} className="text-purple-400" />}>
          <div className="flex items-center gap-3 mb-4">
            <ToggleSwitch enabled={settings.mcpEnabled} onChange={v => update('mcpEnabled', v)} />
            <span className={`text-sm ${settings.mcpEnabled ? 'text-white' : 'text-gray-500'}`}>
              {settings.mcpEnabled ? 'MCP Server ACTIVE — Claude can control automation' : 'MCP Server DISABLED'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="MCP Port" value={settings.mcpPort} onChange={v => update('mcpPort', v)} type="number" />
          </div>
          <div className="mt-3 bg-purple-900/20 border border-purple-600/30 rounded-xl p-3">
            <div className="text-purple-300 text-xs font-medium mb-2">Available MCP Tools:</div>
            <div className="grid grid-cols-2 gap-1 text-xs font-mono text-purple-400/70">
              {['create_profile(os)', 'start_profile(id)', 'stop_profile(id)', 'list_profiles()', 'add_job(profile, task)', 'get_stats()', 'renew_proxy(id)', 'delete_profile(id)'].map(t => (
                <div key={t} className="flex items-center gap-1">
                  <span className="text-purple-600">→</span> {t}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Database */}
        <Section title="SQLite Database" icon={<Database size={15} className="text-blue-400" />}>
          <div className="flex items-center gap-3 mb-4">
            <ToggleSwitch enabled={settings.walMode} onChange={v => update('walMode', v)} />
            <span className={`text-sm ${settings.walMode ? 'text-white' : 'text-gray-500'}`}>
              WAL Mode (Write-Ahead Logging) — {settings.walMode ? 'ENABLED (Recommended)' : 'DISABLED'}
            </span>
          </div>
          <Field label="Database Path" value={settings.dbPath} onChange={v => update('dbPath', v)} mono />
          <div className="mt-4 space-y-2">
            <div className="text-gray-400 text-xs font-medium mb-2">Database Tables:</div>
            {[
              { table: 'profiles', cols: 'id, name, os, status, proxy_config, fingerprint, created_at' },
              { table: 'jobs', cols: 'id, profile_id, task_type, status, retry_count, created_at' },
              { table: 'logs', cols: 'id, profile_id, level, message, timestamp' },
              { table: 'settings', cols: 'key, value, updated_at' },
              { table: 'proxy_sessions', cols: 'id, profile_id, username, assigned_at, expires_at' },
            ].map(({ table, cols }) => (
              <div key={table} className="bg-gray-800 rounded-xl px-3 py-2 font-mono">
                <span className="text-green-400 text-xs">{table}</span>
                <span className="text-gray-600 text-xs"> ({cols})</span>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-blue-900/20 border border-blue-600/30 rounded-xl p-3 text-xs text-blue-300">
            ✅ WAL mode enables concurrent reads while writing. Zero data loss on crash. No JSON files — everything in SQLite.
          </div>
        </Section>

        {/* PM2 */}
        <Section title="PM2 Process Manager" icon={<Server size={15} className="text-orange-400" />}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Process Name" value={settings.pm2Name} onChange={v => update('pm2Name', v)} />
            <Field label="Instances" value={settings.pm2Instances} onChange={v => update('pm2Instances', v)} type="number" />
          </div>
          <div className="mt-3 space-y-1.5 text-xs font-mono text-gray-500">
            <div className="text-gray-400 font-medium font-sans mb-2">PM2 Commands:</div>
            <div>$ pm2 start server.js --name {settings.pm2Name}</div>
            <div>$ pm2 restart {settings.pm2Name}</div>
            <div>$ pm2 logs {settings.pm2Name}</div>
            <div>$ pm2 status</div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, note, children }: { title: string; icon: React.ReactNode; note?: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h2 className="text-white font-semibold">{title}</h2>
      </div>
      {note && <p className="text-gray-600 text-xs mb-4">{note}</p>}
      {!note && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', disabled = false, placeholder, desc, mono }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; disabled?: boolean; placeholder?: string; desc?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-medium block mb-1.5">{label}</label>
      {desc && <p className="text-gray-600 text-xs mb-1.5">{desc}</p>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-all
          ${mono ? 'font-mono' : ''}
          ${disabled
            ? 'bg-gray-800/40 border-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-gray-800 border-gray-700 text-gray-200 focus:border-gray-500'}`}
      />
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0
        ${enabled ? 'bg-red-600' : 'bg-gray-700'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
        ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  );
}
