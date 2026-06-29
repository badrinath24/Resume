export const maxDuration = 60;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserKeys, getWriteKey, callAI } from '@/lib/ai';
import { getCoverLetterPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobTitle, company, jobDescription } = await req.json();
  if (!resumeId) return NextResponse.json({ error: 'resumeId required' }, { status: 400 });

  const keys = await getUserKeys(userId);
  const keyInfo = getWriteKey(keys);
  if (!keyInfo) return NextResponse.json({ error: 'No API key configured. Add your key in Settings.' }, { status: 400 });

  const supabase = createServerClient();
  const { data: row } = await supabase.from('resumes').select('*').eq('id', resumeId).eq('user_id', userId).single();
  if (!row) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const resumeJson = JSON.stringify({
    personal: row.personal_info,
    summary: row.summary,
    experience: row.experience,
    education: row.education,
    skills: row.skills,
  });
  const jobJson = JSON.stringify({ jobTitle, company, jobDescription });

  const coverLetter = await callAI(keyInfo, getCoverLetterPrompt(resumeJson, jobJson), {
    temperature: 0.4,
    maxTokens: 1200,
    timeoutMs: 50000,
    isWriting: true,
  });

  return NextResponse.json({ coverLetter });
}
