'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  jobTitleMatch:       { label: 'Job Title Match',       emoji: '🎯' },
  yearsOfExperience:   { label: 'Years of Experience',   emoji: '📅' },
  educationMatch:      { label: 'Education Match',       emoji: '🎓' },
  hardSkills:          { label: 'Hard Skills',           emoji: '⚙️' },
  softSkills:          { label: 'Soft Skills',           emoji: '🤝' },
  contactInformation:  { label: 'Contact Information',   emoji: '📞' },
  locationMatch:       { label: 'Location Match',        emoji: '📍' },
  formatting:          { label: 'Formatting',            emoji: '📄' },
  wordCount:           { label: 'Word Count',            emoji: '📝' },
  measurableResults:   { label: 'Measurable Results',    emoji: '📊' },
};

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={`${filled} ${circ}`} strokeDashoffset={circ / 4}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="70" y="64" textAnchor="middle" fontSize="28" fontWeight="700" fill={color}>{score}</text>
      <text x="70" y="83" textAnchor="middle" fontSize="11" fill="#6b7280">/100</text>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    good: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    poor: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status === 'good' ? '✓ Good' : status === 'warning' ? '⚠ Needs work' : '✗ Poor'}
    </span>
  );
}

function BarFill({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ATSScorePage() {
  const { id } = useParams<{ id: string }>();
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState(id);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [openCard, setOpenCard] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/resumes').then(r => r.json()).then(d => setResumes(d.resumes ?? []));
  }, []);

  async function analyse() {
    if (!selectedResume) { setError('Please select a resume.'); return; }
    if (!jobDescription.trim()) { setError('Please paste a job description.'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }
      setResult(data.breakdown);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const breakdown = result?.breakdown ?? {};
  const totalScore = result?.totalScore ?? 0;
  const scoreLabel = totalScore >= 70 ? '🟢 Strong Match' : totalScore >= 50 ? '🟡 Moderate Match' : '🔴 Needs Improvement';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/resumes" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">📊 ATS Score Checker</h1>
            <p className="text-gray-500 text-sm mt-0.5">See how well your resume matches any job description</p>
          </div>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

          <button
            onClick={analyse}
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing… (~30s)</>
            ) : '📊 Check ATS Score'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Score hero */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing score={totalScore} />
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-2xl font-extrabold text-gray-900 mb-1">{scoreLabel}</div>
                  {result.jobTitle && (
                    <div className="text-sm text-gray-500 mb-3">
                      {result.jobTitle}{result.company ? ` @ ${result.company}` : ''}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Score', value: `${totalScore}/100`, color: totalScore >= 70 ? 'text-green-600' : totalScore >= 50 ? 'text-yellow-600' : 'text-red-600' },
                      { label: 'Strong', value: `${Object.values(breakdown).filter((c: any) => c.status === 'good').length}/10`, color: 'text-green-600' },
                      { label: 'Needs Work', value: `${Object.values(breakdown).filter((c: any) => c.status !== 'good').length}/10`, color: 'text-red-600' },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-400">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick skill chips */}
            {(breakdown.hardSkills?.matched?.length > 0 || breakdown.hardSkills?.missing?.length > 0) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">⚙️ Hard Skills Breakdown</h2>
                {breakdown.hardSkills?.matched?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-green-700 mb-2">✓ Matched</p>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.hardSkills.matched.map((s: string) => (
                        <span key={s} className="text-xs px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {breakdown.hardSkills?.missing?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-2">✗ Missing</p>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.hardSkills.missing.map((s: string) => (
                        <span key={s} className="text-xs px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">Detailed Breakdown</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {Object.entries(breakdown).map(([key, cat]: [string, any]) => {
                  const meta = CATEGORY_LABELS[key];
                  if (!meta || !cat?.maxScore) return null;
                  const isOpen = openCard === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setOpenCard(isOpen ? null : key)}
                        className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-xl w-7 flex-shrink-0">{meta.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-gray-900">{meta.label}</span>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={cat.status} />
                              <span className="text-xs font-bold text-gray-700">{cat.score}/{cat.maxScore}</span>
                            </div>
                          </div>
                          <BarFill score={cat.score} max={cat.maxScore} />
                        </div>
                        <span className="text-gray-300 text-sm ml-2">{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                          <p className="text-xs text-gray-600 leading-relaxed mt-3 mb-3">{cat.details}</p>

                          {/* Extra fields */}
                          {cat.matched?.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {cat.matched.map((s: string) => <span key={s} className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{s}</span>)}
                            </div>
                          )}
                          {cat.missing?.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {cat.missing.map((s: string) => <span key={s} className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{s}</span>)}
                            </div>
                          )}
                          {cat.examples?.length > 0 && (
                            <div className="mb-3">
                              {cat.examples.map((e: string) => <p key={e} className="text-xs text-gray-500 italic">"{e}"</p>)}
                            </div>
                          )}

                          {cat.suggestions?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-700 mb-1.5">💡 Suggestions</p>
                              <ul className="space-y-1">
                                {cat.suggestions.map((s: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-600 flex gap-2">
                                    <span className="text-red-400 flex-shrink-0">→</span>{s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action strip */}
            <div className="flex gap-3">
              <Link href={`/applications/new?resumeId=${selectedResume}`}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm text-center transition-colors">
                🎯 Tailor Resume for This Job
              </Link>
              <Link href={`/resume/${selectedResume}/cover-letter`}
                className="flex-1 py-3 border border-red-600 text-red-600 hover:bg-red-50 font-bold rounded-xl text-sm text-center transition-colors">
                ✉️ Generate Cover Letter
              </Link>
            </div>

            {/* Re-analyse */}
            <div className="text-center">
              <button onClick={analyse} disabled={loading} className="text-sm text-red-600 font-semibold hover:underline disabled:opacity-50">
                ↺ Re-analyse
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
