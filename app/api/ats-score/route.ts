import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getAIClient, getUserApiKey, DEFAULT_MODEL, FALLBACK_KEY } from '@/lib/nvidia';
import { getATSScorePrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobDescription } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const supabase = createServerClient();
  const { data: row } = await supabase.from('resumes').select('*').eq('id', resumeId).eq('user_id', userId).single();
  if (!row) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const userKey = await getUserApiKey(userId);
  const client = getAIClient(userKey ?? FALLBACK_KEY ?? '');
  const resumeJson = JSON.stringify({ personal: row.personal_info, summary: row.summary, experience: row.experience, education: row.education, skills: row.skills });

  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: getATSScorePrompt(resumeJson, jobDescription) }],
    temperature: 0.1,
    max_tokens: 4096,
  });

  let breakdown: any = {};
  try { breakdown = JSON.parse(completion.choices[0]?.message?.content ?? '{}'); } catch { breakdown = {}; }

  return NextResponse.json({ breakdown });
}
