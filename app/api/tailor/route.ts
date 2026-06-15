import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getAIClient, getUserApiKey, DEFAULT_MODEL, FALLBACK_KEY } from '@/lib/nvidia';
import { getTailoringPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobDescription, tailoringLevel, jobTitle, company } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const supabase = createServerClient();
  const { data: row } = await supabase.from('resumes').select('*').eq('id', resumeId).eq('user_id', userId).single();
  if (!row) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const userKey = await getUserApiKey(userId);
  const client = getAIClient(userKey ?? FALLBACK_KEY ?? '');
  const resumeJson = JSON.stringify({ personal: row.personal_info, summary: row.summary, experience: row.experience, education: row.education, skills: row.skills, certifications: row.certifications, languages: row.languages });

  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: getTailoringPrompt(resumeJson, jobDescription, tailoringLevel ?? 'MEDIUM') }],
    temperature: 0.3,
    max_tokens: 8192,
  });

  let result: any = {};
  try { result = JSON.parse(completion.choices[0]?.message?.content ?? '{}'); } catch { result = {}; }

  const { data: tailored } = await supabase.from('resumes').insert({
    user_id: userId,
    title: `Tailored — ${jobTitle ?? 'Job'} @ ${company ?? 'Company'}`,
    raw_text: row.raw_text,
    personal_info: result.tailoredResume?.personal ?? row.personal_info,
    summary: result.tailoredResume?.summary ?? row.summary,
    experience: result.tailoredResume?.experience ?? row.experience,
    education: result.tailoredResume?.education ?? row.education,
    skills: result.tailoredResume?.skills ?? row.skills,
    certifications: result.tailoredResume?.certifications ?? row.certifications,
    languages: result.tailoredResume?.languages ?? row.languages,
    is_master: false,
  }).select('id').single();

  return NextResponse.json({ tailoredResumeId: tailored?.id, atsScore: result.atsScore, changes: result.changes ?? [], tailoredResume: result.tailoredResume, matchedKeywords: result.matchedKeywords ?? [], missingKeywords: result.missingKeywords ?? [] });
}
