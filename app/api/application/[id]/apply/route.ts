import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { acceptedChanges, liveScore } = await req.json();
  const supabase = createServerClient();

  // Get application + tailored resume
  const { data: app } = await supabase.from('applications').select('*').eq('id', params.id).single();
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: resume } = await supabase.from('resumes').select('*').eq('id', app.tailored_resume_id).single();
  if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  // Apply accepted changes to resume fields
  let summary: string = resume.summary ?? '';
  const experience: any[] = JSON.parse(JSON.stringify(resume.experience ?? []));
  const skills: any[] = JSON.parse(JSON.stringify(resume.skills ?? []));
  const education: any[] = JSON.parse(JSON.stringify(resume.education ?? []));

  for (const change of acceptedChanges) {
    const section: string = (change.section ?? '').toLowerCase();
    const improved: string = change.improved ?? '';

    if (section === 'summary') {
      summary = improved;
    } else if (section.startsWith('experience.')) {
      const parts = section.split('.');
      const expIdx = parseInt(parts[1]);
      const field = parts[2];
      if (field === 'bullets') {
        const bulletIdx = parseInt(parts[3]);
        if (experience[expIdx]?.bullets) experience[expIdx].bullets[bulletIdx] = improved;
      } else if (field && experience[expIdx]) {
        experience[expIdx][field] = improved;
      }
    } else if (section.startsWith('skills.')) {
      const parts = section.split('.');
      const skillIdx = parseInt(parts[1]);
      const field = parts[2];
      if (field === 'items' && skills[skillIdx]) {
        skills[skillIdx].items = improved.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (field && skills[skillIdx]) {
        skills[skillIdx][field] = improved;
      }
    }
  }

  // Update tailored resume and application ATS score
  await supabase.from('resumes').update({ summary, experience, skills, education }).eq('id', app.tailored_resume_id);
  await supabase.from('applications').update({ ats_score: liveScore, score_breakdown: acceptedChanges }).eq('id', params.id);

  return NextResponse.json({ ok: true });
}
