import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-extrabold text-gray-900">
          Resume<span className="bg-red-600 text-white px-1.5 py-0.5 rounded-md text-sm ml-0.5">AI</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
          <Link href="/sign-up" className="text-sm font-semibold px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Get Started</Link>
        </div>
      </nav>

      <section className="flex flex-col items-center text-center px-4 py-24 bg-gradient-to-b from-red-50 to-white">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          🚀 Powered by NVIDIA NIM AI
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 max-w-3xl leading-tight">
          Tailor Your Resume to Any Job in{' '}
          <span className="text-red-600">30 Seconds</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          AI-powered resume tailoring, ATS scoring & cover letters. Free for everyone.
        </p>
        <div className="flex items-center gap-4 mt-10">
          <Link href="/sign-up" className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg">
            Get Started — It&apos;s Free →
          </Link>
          <Link href="/sign-in" className="px-8 py-4 border border-gray-200 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Sign In
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required</p>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: '1', title: 'Upload your resume once', desc: 'Upload your master resume as a PDF or DOCX. AI extracts and stores all your details.' },
            { step: '2', title: 'Open the Chrome extension on any job page', desc: 'Visit any job on LinkedIn, Indeed, Naukri — the panel appears automatically.' },
            { step: '3', title: 'Accept AI changes and download PDF', desc: 'Review tailored suggestions, accept what you like, and export a polished PDF.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-600 text-white text-xl font-bold flex items-center justify-center mb-5 shadow-md">
                {step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">Everything You Need to Land the Job</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'AI Resume Tailoring', desc: 'Rewrite bullets and keywords to match each job description — accept or reject each change.' },
              { icon: '📊', title: 'Live ATS Score', desc: 'See exactly how well your resume ranks across 10 ATS scoring categories.' },
              { icon: '✉️', title: 'Cover Letter Generator', desc: 'Generate a personalised, ATS-optimised cover letter in one click.' },
              { icon: '💼', title: 'Job Tracker', desc: 'Track every application, status update, and tailored resume in one place.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-600">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to land your next job?</h2>
          <p className="text-red-100 mb-8">Join thousands of job seekers using ResumeAI to get more interviews.</p>
          <Link href="/sign-up" className="inline-block px-10 py-4 bg-white text-red-600 text-lg font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg">
            Start for Free →
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        © ResumeAI 2026 · Built with Next.js, Supabase & NVIDIA NIM
      </footer>
    </div>
  );
}
