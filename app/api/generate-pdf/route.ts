import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobTitle, company } = await req.json();
  if (!resumeId) return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 });

  const supabase = createServerClient();
  const { data: row } = await supabase.from('resumes').select('*').eq('id', resumeId).eq('user_id', userId).single();
  if (!row) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const resume = {
    id: row.id, userId: row.user_id, title: row.title, rawText: row.raw_text,
    personalInfo: row.personal_info, summary: row.summary, experience: row.experience,
    education: row.education, skills: row.skills, certifications: row.certifications,
    languages: row.languages, fileUrl: row.file_url, isMaster: row.is_master,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };

  const { renderToBuffer } = await import('@react-pdf/renderer');
  const React = (await import('react')).default;
  const { default: ResumePDF } = await import('@/components/ResumePDF');

  const buffer = await renderToBuffer(React.createElement(ResumePDF, { resume } as any));
  const rawName = `${resume.personalInfo?.name ?? 'Resume'}_${jobTitle ?? ''}_${company ?? ''}`;
  const cleanName = rawName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const fileName = `${userId}/${cleanName}_${Date.now()}.pdf`;

  await supabase.storage.from('generated-pdfs').upload(fileName, buffer, { contentType: 'application/pdf', upsert: true });
  const { data: signedData } = await supabase.storage.from('generated-pdfs').createSignedUrl(fileName, 3600);

  return NextResponse.json({ url: signedData?.signedUrl });
}
