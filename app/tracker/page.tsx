'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  saved:     { emoji: '🔖', label: 'Saved',     color: 'bg-gray-100 text-gray-700' },
  applied:   { emoji: '📤', label: 'Applied',   color: 'bg-blue-100 text-blue-700' },
  interview: { emoji: '🎙️', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  offer:     { emoji: '🎉', label: 'Offer',     color: 'bg-green-100 text-green-700' },
  rejected:  { emoji: '❌', label: 'Rejected',  color: 'bg-red-100 text-red-700' },
};

export default function TrackerPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  async function fetchApps() {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    setApps(data.applications ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchApps(); }, []);

  async function handleStatus(id: string, status: string) {
    await fetch('/api/jobs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    fetchApps();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    fetchApps();
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, k) => ({ ...acc, [k]: apps.filter(a => a.status === k).length }), {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">💼 Job Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">Track every application from saved to offer</p>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(filter === k ? 'all' : k)}
              className={`rounded-2xl border p-3 text-center transition-all ${filter === k ? 'border-teal-400 bg-teal-50 shadow-sm' : 'border-gray-100 bg-white hover:shadow-sm'}`}>
              <div className="text-2xl mb-1">{v.emoji}</div>
              <div className="text-lg font-bold text-gray-900">{counts[k] ?? 0}</div>
              <div className="text-xs text-gray-400">{v.label}</div>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h2>
            <p className="text-gray-500 mb-6">Tailor a resume to start tracking</p>
            <Link href="/resumes" className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700">🎯 Go to Resumes</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app: any) => {
              const sc = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.saved;
              const score = app.ats_score ?? 0;
              const scoreColor = score >= 70 ? 'text-green-600' : score >= 50 ? 'text-orange-500' : 'text-red-500';
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                  <div className="text-3xl">{sc.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900">{app.job_title}</div>
                    <div className="text-sm text-gray-500">{app.company} · {new Date(app.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${scoreColor}`}>{score || '—'}</div>
                    <div className="text-xs text-gray-400">ATS</div>
                  </div>
                  <select value={app.status} onChange={e => handleStatus(app.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 ${sc.color} cursor-pointer focus:outline-none`}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                  </select>
                  {app.tailored_resume_id && (
                    <Link href={`/applications/${app.id}`} className="text-xs text-blue-600 font-semibold hover:underline whitespace-nowrap">View →</Link>
                  )}
                  <button onClick={() => handleDelete(app.id)} className="text-xs text-red-400 hover:text-red-600">🗑️</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
