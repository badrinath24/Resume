'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resumes').then(r => r.json()).then(d => { setResumes(d.resumes ?? []); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">🗂️ My Resumes</h1>
            <p className="text-gray-500 text-sm mt-1">All your uploaded and tailored resumes</p>
          </div>
          <Link href="/resume/new" className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700">
            📄 Upload New
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No resumes yet</h2>
            <p className="text-gray-500 mb-6">Upload your first resume to get started</p>
            <Link href="/resume/new" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">📄 Upload Resume</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resumes.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{r.is_master ? '⭐' : '📝'}</span>
                      <span className="font-bold text-gray-900 text-sm">{r.title}</span>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {r.is_master && <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">Master</span>}
                </div>
                <div className="flex gap-2 flex-wrap mt-4">
                  <Link href={`/resume/edit/${r.id}`} className="flex-1 text-center py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100">✏️ Edit</Link>
                  <Link href={`/applications/new?resumeId=${r.id}`} className="flex-1 text-center py-2 bg-orange-50 text-orange-700 text-xs font-semibold rounded-lg hover:bg-orange-100">🎯 Tailor</Link>
                  <Link href={`/resume/${r.id}/ats`} className="flex-1 text-center py-2 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100">📊 ATS</Link>
                  <Link href={`/resume/${r.id}/cover-letter`} className="flex-1 text-center py-2 bg-pink-50 text-pink-700 text-xs font-semibold rounded-lg hover:bg-pink-100">✉️ Cover</Link>
                  <Link href={`/resume/${r.id}/download`} className="flex-1 text-center py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100">⬇️ PDF</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
