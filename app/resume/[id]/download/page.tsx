'use client';

import { useParams } from 'next/navigation';

export default function DownloadPage() {
  const { id } = useParams<{ id: string }>();

  function openPrint() {
    window.open(`/resume/${id}/print?template=harvard`, '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Download Resume</h1>
        <p className="text-gray-500 text-sm mb-8">Opens a print preview — choose "Save as PDF" in your browser</p>
        <button
          onClick={openPrint}
          className="px-8 py-4 bg-red-600 text-white font-bold text-base rounded-xl hover:bg-red-700"
        >
          ⬇️ Download as PDF
        </button>
        <div className="mt-4">
          <button onClick={() => window.history.back()} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
        </div>
      </div>
    </div>
  );
}
