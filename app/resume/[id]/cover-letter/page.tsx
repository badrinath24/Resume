'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';


export default function CoverLetterPage() {
  const { id } = useParams<{ id: string }>();

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState(id);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/resumes').then(r => r.json()).then(d => setResumes(d.resumes ?? []));
  }, []);

  async function generate() {
    if (!selectedResume) { setError('Please select a resume.'); return; }
    setLoading(true);
    setError('');
    setCoverLetter('');
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, jobTitle, company, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }
      setCoverLetter(data.coverLetter);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openPDF() {
    const encoded = encodeURIComponent(coverLetter);
    window.open(`/cover-letter/print?template=harvard&content=${encoded}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/resumes" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">✉️ Cover Letter Generator</h1>
            <p className="text-gray-500 text-sm mt-0.5">AI-written, ATS-optimised, personalised to the job</p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Resume selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Resume</label>
            <select
              value={selectedResume}
              onChange={e => setSelectedResume(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">— choose a resume —</option>
              {resumes.map(r => (
                <option key={r.id} value={r.id}>{r.title}{r.is_master ? ' ⭐' : ''}</option>
              ))}
            </select>
          </div>

          {/* Job details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Job Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Job Title</label>
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Product Manager"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Company</label>
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Job Description <span className="text-gray-400">(paste here for best results)</span></label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description..."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating cover letter… (~30s)
              </>
            ) : '✉️ Generate Cover Letter'}
          </button>

          {/* Output */}
          {coverLetter && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">Generated Cover Letter</span>
                  <div className="flex gap-2">
                    <button
                      onClick={copy}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={openPDF}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ⬇️ Download PDF
                    </button>
                  </div>
                </div>

                {/* Letter body — editable */}
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="w-full px-6 py-5 text-gray-800 focus:outline-none resize-none"
                  rows={28}
                  style={{ fontFamily: 'Georgia, serif', fontSize: '13px', lineHeight: '1.8' }}
                />

                {/* Re-generate */}
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">You can edit the letter directly above</span>
                  <button onClick={generate} disabled={loading} className="text-xs text-red-600 font-semibold hover:underline disabled:opacity-50">
                    ↺ Regenerate
                  </button>
                </div>
              </div>

            </>
          )}

        </div>
      </div>
    </div>
  );
}
