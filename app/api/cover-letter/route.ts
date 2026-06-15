import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getAIClient, getUserApiKey, DEFAULT_MODEL, FALLBACK_KEY } from '@/lib/nvidia';
import { getCoverLetterPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobTitle, company, jobDescription, applicationId } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const supabase = createServerClient();
  const { data: row } = await supabase.from('resumes').select('*').eq('id', resumeId).eq('user_id', userId).single();
  if (!row) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const userKey = await getUserApiKey(userId);
  const client = getAIClient(userKey ?? FALLBACK_KEY ?? '');
  const resumeJson = JSON.stringify({ personal: row.personal_info, summary: row.summary, experience: row.experience, skills: row.skills });
  const jobJson = JSON.stringify({ jobTitle, company, description: jobDescription });

  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: getCoverLetterPrompt(resumeJson, jobJson) }],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content ?? '';
  const { data } = await supabase.from('cover_letters').insert({ user_id: userId, application_id: applicationId ?? null, content }).select('id').single();

  return NextResponse.json({ id: data?.id, content });
}
