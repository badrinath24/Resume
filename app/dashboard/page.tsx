'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const FEATURES = [
  {
    emoji: '📄',
    title: 'Upload Resume',
    desc: 'Parse your existing resume with AI and store it in your profile',
    href: '/resume/new',
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    emoji: '🗂️',
    title: 'My Resumes',
    desc: 'View and edit all your uploaded and tailored resumes',
    href: '/resumes',
    color: 'from-red-400 to-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    emoji: '🎯',
    title: 'Tailor for a Job',
    desc: 'Paste a job description and get an AI-tailored resume with ATS score',
    href: '/resumes',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    emoji: '📊',
    title: 'ATS Score',
    desc: 'Check how well your resume matches any job description',
    href: '/resumes',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    emoji: '✉️',
    title: 'Cover Letter',
    desc: 'Generate a personalised, ATS-optimised cover letter in seconds',
    href: '/resumes',
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
  },
  {
    emoji: '💼',
    title: 'Job Tracker',
    desc: 'Track every application — saved, applied, interview, offer, rejected',
    href: '/tracker',
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    emoji: '⬇️',
    title: 'Download PDF',
    desc: 'Export your resume in beautiful templates — Harvard, Modern, Classic & more',
    href: '/resumes',
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    emoji: '⚙️',
    title: 'Settings',
    desc: 'Manage your profile, API keys and preferences',
    href: '/settings',
    color: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
  },
];

const STEPS = [
  { emoji: '1️⃣', text: 'Upload your resume' },
  { emoji: '2️⃣', text: 'Paste a job description' },
  { emoji: '3️⃣', text: 'Get AI-tailored resume + ATS score' },
  { emoji: '4️⃣', text: 'Generate cover letter' },
  { emoji: '5️⃣', text: 'Download PDF in your template' },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({ resumes: 0, applications: 0 });

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d)).catch(() => {});
  }, []);

  const firstName = user?.firstName ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Hero greeting */}
        <div className="text-center space-y-3 py-6">
          <div className="text-4xl">🚀</div>
          <h1 className="text-3xl font-extrabold text-gray-900">{greeting}, {firstName}!</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Your AI-powered career toolkit. Land more interviews with perfectly tailored resumes.
          </p>

          {/* Quick stats */}
          <div className="flex justify-center gap-6 pt-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.resumes}</div>
              <div className="text-xs text-gray-400 font-medium">Resumes</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3 text-center">
              <div className="text-2xl font-bold text-orange-500">{stats.applications}</div>
              <div className="text-xs text-gray-400 font-medium">Applications</div>
            </div>
          </div>
        </div>

        {/* Quick start banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 text-white flex items-center justify-between gap-6 flex-wrap shadow-lg">
          <div>
            <div className="text-lg font-bold mb-1">✨ Quick Start</div>
            <p className="text-red-100 text-sm">Upload your resume to get started in under 2 minutes</p>
          </div>
          <Link href="/resume/new" className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm whitespace-nowrap">
            📄 Upload Resume →
          </Link>
        </div>

        {/* Feature grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">🛠️ What do you want to do?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <Link key={i} href={f.href} className={`group rounded-2xl border ${f.border} ${f.bg} p-5 hover:shadow-md transition-all hover:-translate-y-0.5`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  {f.emoji}
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{f.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⚡ How it works</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1 flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                <span className="text-lg">{s.emoji}</span>
                <span className="text-xs text-gray-600 font-medium leading-relaxed">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-4">
          Built with ❤️ using Next.js · Supabase · NVIDIA NIM · Clerk
        </div>
      </div>
    </div>
  );
}
