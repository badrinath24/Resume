'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const TEMPLATES = [
  {
    id: 'harvard',
    name: 'Harvard',
    description: 'Centered header, serif font, classic sections',
    color: '#000000',
    preview: 'bg-gray-800',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean blue accents, two-column skills',
    color: '#1a56db',
    preview: 'bg-blue-600',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif, centered header',
    color: '#111827',
    preview: 'bg-gray-900',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean, lots of whitespace',
    color: '#6b7280',
    preview: 'bg-gray-500',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Dark header band, corporate style',
    color: '#065f46',
    preview: 'bg-emerald-800',
  },
];

export default function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const [selected, setSelected] = useState('harvard');
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/resume/${id}`).then(r => r.json()).then(d => setResume(d.resume));
  }, [id]);

  function openPrint() {
    window.open(`/resume/${id}/print?template=${selected}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choose a Template</h1>
            <p className="text-gray-500 text-sm mt-1">Pick a style, then download your resume as PDF</p>
          </div>
          <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`relative rounded-2xl border-2 overflow-hidden text-left transition-all ${selected === t.id ? 'border-blue-500 shadow-lg scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              {/* Template preview mockup */}
              <div className="bg-white p-4 h-48 flex flex-col gap-2">
                <div className={`h-6 rounded ${t.preview} opacity-90`} />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 bg-gray-200 rounded w-full" />
                  <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                  <div className="h-1.5 bg-gray-200 rounded w-4/5" />
                  <div className="h-1.5 bg-gray-100 rounded w-full" />
                  <div className="h-1.5 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className={`h-1.5 rounded w-full`} style={{ background: t.color, opacity: 0.7 }} />
                    <div className="h-1.5 bg-gray-100 rounded w-full" />
                    <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                  </div>
                  <div className="space-y-1">
                    <div className={`h-1.5 rounded w-full`} style={{ background: t.color, opacity: 0.7 }} />
                    <div className="h-1.5 bg-gray-100 rounded w-full" />
                    <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.description}</p>
                  </div>
                  {selected === t.id && (
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={openPrint}
          className="w-full py-4 bg-blue-600 text-white font-bold text-base rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          ⬇️ Download as PDF — {TEMPLATES.find(t => t.id === selected)?.name} Template
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">A print preview will open. Choose "Save as PDF" in your browser print dialog.</p>
      </div>
    </div>
  );
}
