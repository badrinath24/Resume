'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ApplicationResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState<Record<number, boolean>>({});
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/application/${id}`).then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
      // Accept all by default
      if (Array.isArray(d?.application?.score_breakdown)) {
        const initAccepted: Record<number, boolean> = {};
        const initEdits: Record<number, string> = {};
        d.application.score_breakdown.forEach((c: any, i: number) => {
          initAccepted[i] = true;
          initEdits[i] = c.improved ?? '';
        });
        setAccepted(initAccepted);
        setEdits(initEdits);
      }
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
    </div>
  );

  if (!data?.application) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Application not found.</div>
  );

  const app = data.application;
  const changes: any[] = Array.isArray(app.score_breakdown) ? app.score_breakdown : [];
  const baseScore = app.ats_score ?? 0;
  const totalChangePoints = changes.reduce((s: number, c: any) => s + (c.scoreImpact ?? 0), 0);
  const acceptedPoints = changes.reduce((s: number, c: any, i: number) => accepted[i] ? s + (c.scoreImpact ?? 0) : s, 0);
  const liveScore = Math.min(100, Math.max(0, Math.round(baseScore - totalChangePoints + acceptedPoints)));
  const scoreColor = liveScore >= 70 ? 'text-green-600' : liveScore >= 50 ? 'text-orange-500' : 'text-red-500';
  const scoreBg = liveScore >= 70 ? 'bg-green-50 border-green-200' : liveScore >= 50 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';
  const acceptedCount = Object.values(accepted).filter(Boolean).length;

  async function handleSaveChanges() {
    setSaving(true);
    const acceptedChanges = changes
      .filter((_, i) => accepted[i])
      .map((c, i) => ({ ...c, improved: edits[i] ?? c.improved }));
    await fetch(`/api/application/${id}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acceptedChanges, liveScore }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggleAll(val: boolean) {
    const next: Record<number, boolean> = {};
    changes.forEach((_, i) => { next[i] = val; });
    setAccepted(next);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{app.job_title}</h1>
          <p className="text-gray-500 text-sm">{app.company}</p>
        </div>

        {/* Live ATS Score card */}
        <div className={`rounded-2xl border p-6 flex items-center justify-between ${scoreBg}`}>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Live ATS Score</p>
            <p className="text-xs text-gray-400">{acceptedCount} of {changes.length} changes accepted</p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>{liveScore}</div>
            <div className="text-xs text-gray-400 mt-1">/ 100</div>
          </div>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => toggleAll(true)} className="px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
            ✓ Accept All
          </button>
          <button onClick={() => toggleAll(false)} className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            ✗ Reject All
          </button>
          <button onClick={handleSaveChanges} disabled={saving} className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 ml-auto">
            {saving && <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />}
            {saving ? 'Saving…' : '💾 Save Accepted Changes'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
        </div>

        {/* Action links */}
        <div className="flex gap-3 flex-wrap">
          {app.tailored_resume_id && (
            <Link href={`/resume/edit/${app.tailored_resume_id}`} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
              ✏️ Edit Tailored Resume
            </Link>
          )}
          {app.tailored_resume_id && (
            <a href={`/resume/${app.tailored_resume_id}/download`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">
              ⬇️ Download PDF
            </a>
          )}
          {app.tailored_resume_id && (
            <Link href={`/resume/${app.tailored_resume_id}/cover-letter`} className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600">
              ✉️ Cover Letter
            </Link>
          )}
          <Link href="/dashboard" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
            ← Dashboard
          </Link>
        </div>

        {/* Changes list */}
        {changes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Changes Made ({changes.length})</h2>
            {changes.map((change: any, i: number) => {
              const isAccepted = accepted[i] ?? true;
              return (
                <div key={i} className={`bg-white rounded-2xl border p-5 transition-all ${isAccepted ? 'border-green-200' : 'border-gray-100 opacity-60'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{change.section}</span>
                        <span className="text-xs text-green-600 font-semibold">+{change.scoreImpact ?? 0} pts</span>
                        {isAccepted
                          ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Accepted</span>
                          : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Rejected</span>}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-1">BEFORE</p>
                          <p className={`text-sm ${isAccepted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{change.original}</p>
                        </div>
                        <div>
                          <p className="text-xs text-green-600 font-medium mb-1">AFTER <span className="text-gray-400 font-normal normal-case">(editable)</span></p>
                          <textarea
                            value={edits[i] ?? change.improved}
                            onChange={e => setEdits(prev => ({ ...prev, [i]: e.target.value }))}
                            disabled={!isAccepted}
                            rows={3}
                            className={`w-full text-sm rounded-lg border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors ${isAccepted ? 'text-gray-900 border-green-200 bg-green-50 font-medium' : 'text-gray-400 border-gray-100 bg-gray-50 cursor-not-allowed'}`}
                          />
                        </div>
                        <p className="text-xs text-gray-400 italic">{change.reason}</p>
                      </div>
                    </div>

                    {/* Accept / Reject buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => setAccepted(prev => ({ ...prev, [i]: true }))}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${isAccepted ? 'bg-green-500 text-white shadow-md scale-110' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}
                      >✓</button>
                      <button
                        onClick={() => setAccepted(prev => ({ ...prev, [i]: false }))}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${!isAccepted ? 'bg-red-500 text-white shadow-md scale-110' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'}`}
                      >✗</button>
                    </div>
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
