'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

const MAX_SIZE = 2 * 1024 * 1024;

export default function NewResumePage() {
  const router = useRouter();
  const [resumeName, setResumeName] = useState('');
  const [nameError, setNameError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    setFileError('');
    if (rejected.length > 0) {
      const code = rejected[0].errors[0].code;
      if (code === 'file-too-large') setFileError('File exceeds 2 MB limit.');
      else if (code === 'file-invalid-type') setFileError('Only PDF and DOCX files are accepted.');
      else setFileError('Invalid file.');
      return;
    }
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeName.trim()) { setNameError('Resume name is required.'); return; }
    if (!file) { setFileError('Please upload a PDF or DOCX file.'); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', resumeName.trim());
    const res = await fetch('/api/parse-resume', { method: 'POST', body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.id) router.push(`/resume/edit/${data.id}`);
    else setFileError(data.error ?? 'Upload failed. Please try again.');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Resume</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={resumeName}
              onChange={e => { setResumeName(e.target.value); setNameError(''); }}
              placeholder="e.g. Software Engineer Resume"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
            <p className="text-xs text-gray-400 mb-3">Accepted formats: PDF, DOCX — max 2 MB</p>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div>
                  <p className="text-green-700 font-medium text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB — click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-sm text-gray-600">{isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}</p>
                </div>
              )}
            </div>
            {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
          </div>

          <button type="submit" disabled={uploading} className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Uploading & Parsing…</> : 'Upload & Parse Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}
