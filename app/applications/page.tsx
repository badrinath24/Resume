'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(d => {
      setApps(d.applications ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">🎯 Applications</h1>
            <p className="text-gray-500 text-sm mt-1">All your AI-tailored resume applications</p>
          </div>
          <Link href="/applications/new"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
            + New Application
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h2>
            <p className="text-gray-500 mb-6">Tailor your resume for a job to get started</p>
            <Link href="/applications/new"
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">
              🎯 Tailor a Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app: any) => {
              const score = app.ats_score ?? 0;
              const scoreColor = score >= 70 ? 'text-green-600 bg-green-50' : score >= 50 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
              const date = new Date(app.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              const statusColors: Record<string, string> = {
                saved: 'bg-gray-100 text-gray-600',
                applied: 'bg-red-100 text-red-700',
                interview: 'bg-purple-100 text-purple-700',
                offer: 'bg-green-100 text-green-700',
                rejected: 'bg-red-100 text-red-600',
              };

              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {app.job_title || 'Untitled Role'}
                        </h3>
                        {app.company && (
                          <span className="text-xs text-red-600 font-semibold">@ {app.company}</span>
                        )}
                        {app.status && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {app.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{date}</p>
                    </div>

                    {score > 0 && (
                      <div className={`flex-shrink-0 text-center px-3 py-1.5 rounded-xl ${scoreColor}`}>
                        <div className="text-lg font-extrabold">{score}</div>
                        <div className="text-xs font-medium">ATS</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap mt-4">
                    <Link href={`/applications/${app.id}`}
                      className="flex-1 text-center py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100">
                      👁️ View Changes
                    </Link>
                    {app.tailored_resume_id && (
                      <>
                        <Link href={`/resume/${app.tailored_resume_id}/download`}
                          className="flex-1 text-center py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100">
                          ⬇️ PDF
                        </Link>
                        <Link href={`/resume/${app.tailored_resume_id}/cover-letter`}
                          className="flex-1 text-center py-2 bg-pink-50 text-pink-700 text-xs font-semibold rounded-lg hover:bg-pink-100">
                          ✉️ Cover Letter
                        </Link>
                        <Link href={`/resume/${app.tailored_resume_id}/ats`}
                          className="flex-1 text-center py-2 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100">
                          📊 ATS
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
