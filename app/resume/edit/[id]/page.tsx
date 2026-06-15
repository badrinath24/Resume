'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Resume, ResumeExperience, ResumeEducation, ResumeSkillGroup, ResumeCertification, ResumeLanguage } from '@/lib/types';

const emptyExp = (): ResumeExperience => ({ company: '', title: '', startDate: '', endDate: '', location: '', bullets: [''] });
const emptyEdu = (): ResumeEducation => ({ school: '', degree: '', startDate: '', endDate: '', grade: '' });
const emptySkill = (): ResumeSkillGroup => ({ category: '', items: [] });
const emptyCert = (): ResumeCertification => ({ name: '', issuer: '', date: '', url: '' });
const emptyLang = (): ResumeLanguage => ({ language: '', proficiency: '' });

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
  );
}

export default function EditResumePage() {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/resume/${id}`).then(r => r.json()).then(d => setResume(d.resume));
  }, [id]);

  function update(path: string[], value: any) {
    setResume(prev => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      let obj: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (obj[path[i]] === undefined || obj[path[i]] === null) obj[path[i]] = {};
        obj = obj[path[i]];
      }
      if (obj !== undefined && obj !== null) obj[path[path.length - 1]] = value;
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/resume/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resume) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!resume) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>;

  const p = resume.personalInfo ?? {};

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
            {saving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
        {saved && <p className="text-green-600 text-sm font-medium">Saved successfully!</p>}

        {/* Action bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href={`/applications/new?resumeId=${id}`} className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
            🎯 Tailor for a Job
          </Link>
          <Link href={`/resume/${id}/ats`} className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700">
            📊 ATS Score
          </Link>
          <Link href={`/resume/${id}/cover-letter`} className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600">
            ✉️ Cover Letter
          </Link>
          <a href={`/resume/${id}/download`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700">
            ⬇️ Download PDF
          </a>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['name','email','phone','location','linkedin','portfolio'] as const).map(k => (
              <Input key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={(p as any)[k] ?? ''} onChange={v => update(['personalInfo', k], v)} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Summary</h2>
          <textarea rows={4} value={resume.summary ?? ''} onChange={e => update(['summary'], e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Experience</h2>
            <button onClick={() => update(['experience'], [...(resume.experience ?? []), emptyExp()])} className="text-sm text-green-600 font-medium hover:underline">+ Add Entry</button>
          </div>
          {(resume.experience ?? []).map((exp, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Company" value={exp.company} onChange={v => update(['experience', String(i), 'company'], v)} />
                <Input label="Title" value={exp.title} onChange={v => update(['experience', String(i), 'title'], v)} />
                <Input label="Start Date" value={exp.startDate} onChange={v => update(['experience', String(i), 'startDate'], v)} />
                <Input label="End Date" value={exp.endDate} onChange={v => update(['experience', String(i), 'endDate'], v)} />
                <Input label="Location" value={exp.location} onChange={v => update(['experience', String(i), 'location'], v)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bullets</label>
                {(exp.bullets ?? []).map((b, j) => (
                  <input key={j} value={b} onChange={e => { const bullets = [...exp.bullets]; bullets[j] = e.target.value; update(['experience', String(i), 'bullets'], bullets); }} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-green-500" />
                ))}
                <button onClick={() => update(['experience', String(i), 'bullets'], [...(exp.bullets ?? []), ''])} className="text-xs text-green-600 hover:underline">+ Add bullet</button>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Education</h2>
            <button onClick={() => update(['education'], [...(resume.education ?? []), emptyEdu()])} className="text-sm text-green-600 font-medium hover:underline">+ Add Entry</button>
          </div>
          {(resume.education ?? []).map((edu, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
              <Input label="School" value={edu.school} onChange={v => update(['education', String(i), 'school'], v)} />
              <Input label="Degree" value={edu.degree} onChange={v => update(['education', String(i), 'degree'], v)} />
              <Input label="Start Date" value={edu.startDate} onChange={v => update(['education', String(i), 'startDate'], v)} />
              <Input label="End Date" value={edu.endDate} onChange={v => update(['education', String(i), 'endDate'], v)} />
              <Input label="Grade / GPA" value={edu.grade} onChange={v => update(['education', String(i), 'grade'], v)} />
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Skills</h2>
            <button onClick={() => update(['skills'], [...(resume.skills ?? []), emptySkill()])} className="text-sm text-green-600 font-medium hover:underline">+ Add Group</button>
          </div>
          {(resume.skills ?? []).map((sg, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 mb-4 space-y-2">
              <Input label="Category" value={sg.category} onChange={v => update(['skills', String(i), 'category'], v)} />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Items (comma-separated)</label>
                <input value={(sg.items ?? []).join(', ')} onChange={e => update(['skills', String(i), 'items'], e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Certifications</h2>
            <button onClick={() => update(['certifications'], [...(resume.certifications ?? []), emptyCert()])} className="text-sm text-green-600 font-medium hover:underline">+ Add</button>
          </div>
          {(resume.certifications ?? []).map((cert, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
              <Input label="Name" value={cert.name} onChange={v => update(['certifications', String(i), 'name'], v)} />
              <Input label="Issuer" value={cert.issuer} onChange={v => update(['certifications', String(i), 'issuer'], v)} />
              <Input label="Date" value={cert.date} onChange={v => update(['certifications', String(i), 'date'], v)} />
              <Input label="URL" value={cert.url} onChange={v => update(['certifications', String(i), 'url'], v)} />
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Languages</h2>
            <button onClick={() => update(['languages'], [...(resume.languages ?? []), emptyLang()])} className="text-sm text-green-600 font-medium hover:underline">+ Add</button>
          </div>
          {(resume.languages ?? []).map((lang, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
              <Input label="Language" value={lang.language} onChange={v => update(['languages', String(i), 'language'], v)} />
              <Input label="Proficiency" value={lang.proficiency} onChange={v => update(['languages', String(i), 'proficiency'], v)} />
            </div>
          ))}
        </section>

        <div className="pb-10">
          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
            {saving ? 'Saving…' : 'Save Resume'}
          </button>
          {saved && <p className="text-green-600 text-sm font-medium text-center mt-2">Saved successfully!</p>}
        </div>
      </div>
    </div>
  );
}
