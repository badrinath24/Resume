'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const NAV_LINKS = [
  { href: '/dashboard',      label: 'Home',        emoji: '🏠' },
  { href: '/resumes',        label: 'Resumes',     emoji: '🗂️' },
  { href: '/applications',   label: 'Applications',emoji: '🎯' },
  { href: '/tracker',        label: 'Tracker',     emoji: '💼' },
  { href: '/settings',       label: 'Settings',    emoji: '⚙️' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  if (!isSignedIn) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-1.5 font-extrabold text-gray-900 text-lg tracking-tight">
          Resume<span className="bg-red-600 text-white px-1.5 py-0.5 rounded-md text-sm">AI</span>
        </Link>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, emoji }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{emoji}</span>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile links */}
        <div className="flex sm:hidden items-center gap-2 overflow-x-auto">
          {NAV_LINKS.map(({ href, emoji }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href}
                className={`text-xl p-1.5 rounded-lg ${active ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                {emoji}
              </Link>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <Link href="/resume/new"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">
            + Upload Resume
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
