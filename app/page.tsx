import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">ResumeAI</span>
        <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Sign In
        </Link>
      </nav>

      <section className="flex flex-col items-center text-center px-4 py-24 bg-gradient-to-b from-gray-50 to-white">
        <h1 className="text-5xl font-extrabold text-gray-900 max-w-3xl leading-tight">
          Tailor Your Resume to Any Job in{' '}
          <span className="text-green-600">30 Seconds</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          AI-powered ATS optimization. Free for everyone.
        </p>
        <Link
          href="/sign-up"
          className="mt-10 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
        >
          Get Started — It&apos;s Free
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: '1', title: 'Upload your resume once', desc: 'Upload your master resume as a PDF or DOCX. We parse and store it securely.' },
            { step: '2', title: 'Browse to any job page and open the extension', desc: 'Find a job you like. Click the ResumeAI extension and we extract the job details automatically.' },
            { step: '3', title: 'Accept AI suggestions and download your PDF', desc: 'Review the tailored resume, accept changes, and download a polished PDF in seconds.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-green-600 text-white text-xl font-bold flex items-center justify-center mb-5 shadow">
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
              { icon: '✦', title: 'AI Resume Tailoring', desc: 'Rewrite bullets and keywords to match each job description perfectly.' },
              { icon: '◎', title: 'Live ATS Score', desc: 'See exactly how well your resume ranks across 10 scoring categories.' },
              { icon: '✉', title: 'Cover Letter Generation', desc: 'Generate a compelling, role-specific cover letter in one click.' },
              { icon: '⊞', title: 'Job Application Tracker', desc: 'Track every application, status, and tailored resume in one place.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        © ResumeAI 2026
      </footer>
    </div>
  );
}
