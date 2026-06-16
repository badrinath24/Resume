'use client';

import { useEffect, useState } from 'react';

const API_KEYS = [
  {
    id: 'nvidia_api_key',
    label: 'NVIDIA Parse Key',
    desc: 'Resume parsing — Qwen3 model',
    placeholder: 'nvapi-••••••••••••••••••••••',
    link: 'https://build.nvidia.com',
    linkLabel: 'Get at build.nvidia.com →',
    icon: '⚡',
    border: 'border-green-200',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    id: 'nvidia_write_key',
    label: 'NVIDIA Write Key',
    desc: 'Tailoring & cover letters — Llama 3.3',
    placeholder: 'nvapi-••••••••••••••••••••••',
    link: 'https://build.nvidia.com',
    linkLabel: 'Get at build.nvidia.com →',
    icon: '✍️',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'openai_api_key',
    label: 'OpenAI API Key',
    desc: 'Optional fallback AI provider',
    placeholder: 'sk-••••••••••••••••••••••••••',
    link: 'https://platform.openai.com/api-keys',
    linkLabel: 'Get at platform.openai.com →',
    icon: '🤖',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'groq_api_key',
    label: 'Groq API Key',
    desc: 'Optional ultra-fast inference',
    placeholder: 'gsk_••••••••••••••••••••••••',
    link: 'https://console.groq.com/keys',
    linkLabel: 'Get at console.groq.com →',
    icon: '🚀',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100 text-orange-700',
  },
];

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<string, string>>({
    nvidia_api_key: '', nvidia_write_key: '', openai_api_key: '', groq_api_key: '',
  });
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings/api-key')
      .then(r => r.json())
      .then(d => {
        if (d.keys) {
          setKeys(prev => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(d.keys).map(([k, v]) => [k, (v as string) ?? ''])
            ),
          }));
        }
      });
  }, []);

  async function save() {
    setSaving(true);
    setError('');
    const res = await fetch('/api/settings/api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError('Failed to save. Please try again.');
  }

  async function deleteAccount() {
    if (!confirm('This permanently deletes your account and all data. Continue?')) return;
    await fetch('/api/account', { method: 'DELETE' });
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6 space-y-8">

        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">⚙️ Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your API keys — stored securely in your account</p>
        </div>

        {/* 4 API key cards */}
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">API Keys</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {API_KEYS.map(k => (
              <div key={k.id} className={`rounded-2xl border ${k.border} ${k.bg} p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${k.iconBg} flex-shrink-0`}>
                    {k.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{k.label}</p>
                    <p className="text-xs text-gray-500">{k.desc}</p>
                  </div>
                </div>

                <div className="relative mb-2">
                  <input
                    type={show[k.id] ? 'text' : 'password'}
                    value={keys[k.id] ?? ''}
                    onChange={e => setKeys(prev => ({ ...prev, [k.id]: e.target.value }))}
                    placeholder={k.placeholder}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-400 pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(p => ({ ...p, [k.id]: !p[k.id] }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 px-1.5 py-1 bg-gray-100 rounded-md"
                  >
                    {show[k.id] ? 'Hide' : 'Show'}
                  </button>
                </div>

                {keys[k.id] && (
                  <p className="text-xs text-green-600 font-medium mb-1">✓ Key saved</p>
                )}

                <a href={k.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:underline">
                  {k.linkLabel}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Save bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            {saved && <p className="text-green-600 text-sm font-semibold">✓ All keys saved!</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {!saved && !error && <p className="text-xs text-gray-400">Keys are encrypted and only used for AI calls on your behalf</p>}
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving…' : '💾 Save All Keys'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border-2 border-red-200 p-6">
          <h2 className="text-base font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
          <button onClick={deleteAccount}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
            🗑️ Delete My Account
          </button>
        </div>

      </div>
    </div>
  );
}
