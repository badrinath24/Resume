export const maxDuration = 60;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserKeys, getWriteKey, callAI, extractJSON } from '@/lib/ai';
import { getATSScorePrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobDescription } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

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

  const raw = await callAI(keyInfo, getATSScorePrompt(resumeJson, jobDescription), {
    temperature: 0.1,
    maxTokens: 2000,
    timeoutMs: 50000,
    isWriting: true,
  });

  const breakdown = extractJSON(raw);
  return NextResponse.json({ breakdown });
}
