'use client';

import { useEffect, useState } from 'react';

interface Application {
  id: string;
  job_title: string;
  company: string;
  ats_score: number;
  status: string;
  created_at: string;
}

function ATSBadge({ score }: { score: number }) {
  const color =
    score >= 75 ? 'bg-green-100 text-green-800' :
    score >= 50 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {score ?? '—'}
    </span>
  );
}

function AddJobModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, company, jobUrl, jobDescription }),
    });
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Add New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input required value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input required value={company} onChange={e => setCompany(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
            <input value={jobUrl} onChange={e => setJobUrl(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea rows={4} value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchApplications() {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    setApplications(data.applications ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchApplications(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this application?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    fetchApplications();
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch('/api/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchApplications();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Track your tailored applications</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            + Add New Job
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No jobs saved yet</h2>
            <p className="text-gray-500">Go to any job page and click the extension to start, or add one manually above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Job Title', 'Company', 'ATS Score', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.job_title}</td>
                    <td className="px-6 py-4 text-gray-600">{app.company}</td>
                    <td className="px-6 py-4"><ATSBadge score={app.ats_score} /></td>
                    <td className="px-6 py-4 text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(app.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && <AddJobModal onClose={() => setShowModal(false)} onSaved={fetchApplications} />}
    </div>
  );
}
