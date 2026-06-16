import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeAI — AI Resume Tailor',
  description: 'AI-powered resume tailoring, ATS scoring and cover letter generation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body className="bg-gray-50">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
