'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/settings/api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nvidiaApiKey: apiKey }),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError('Failed to save API key. Please try again.');
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure? This permanently deletes your account and all data.')) return;
    await fetch('/api/account', { method: 'DELETE' });
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">NVIDIA API Key</h2>
          <p className="text-sm text-gray-500 mb-1">
            Bring your own key for unlimited AI requests.{' '}
            <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              Get a key at build.nvidia.com →
            </a>
          </p>
          <p className="text-xs text-gray-400 mb-6">Your key is stored encrypted and only used to call the NVIDIA NIM API on your behalf.</p>
          <form onSubmit={handleSaveKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="nvapi-••••••••••••••••••••••••" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {saved && <p className="text-green-600 text-sm font-medium">API key saved successfully!</p>}
            <button type="submit" disabled={saving || !apiKey.trim()} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
              {saving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
              {saving ? 'Saving…' : 'Save API Key'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-8">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-6">Permanently delete your account and all associated data. This cannot be undone.</p>
          <button onClick={handleDeleteAccount} className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  );
}
