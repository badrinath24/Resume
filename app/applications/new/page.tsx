'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function NewApplicationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get('resumeId') ?? '';

  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [tailoringLevel, setTailoringLevel] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobDescription.trim()) { setError('Please paste a job description.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobDescription, jobTitle, company, tailoringLevel }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); setLoading(false); return; }
      router.push(`/applications/${data.applicationId}`);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tailor Resume for a Job</h1>
        <p className="text-gray-500 text-sm mb-8">Paste the job description and we'll tailor your resume + score your ATS match.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Job Title <span className="text-gray-400">(optional — auto-detected)</span></label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Company <span className="text-gray-400">(optional — auto-detected)</span></label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Job Description *</label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={12}
                placeholder="Paste the full job description here..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Tailoring Level</label>
              <div className="flex gap-3">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map(lvl => (
                  <button key={lvl} type="button" onClick={() => setTailoringLevel(lvl)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${tailoringLevel === lvl ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}>
                    {lvl === 'LOW' ? '🟡 Low' : lvl === 'MEDIUM' ? '🟠 Medium' : '🔴 High'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {tailoringLevel === 'LOW' ? 'Keywords added only — minimal rewriting.' : tailoringLevel === 'MEDIUM' ? 'Summary + top bullets rewritten for best ATS match.' : 'Full aggressive rewrite for maximum ATS score.'}
              </p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
            {loading ? 'Tailoring Resume… (this takes ~30 seconds)' : '🎯 Tailor My Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}
