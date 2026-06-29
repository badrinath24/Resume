export const maxDuration = 60;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserKeys, getParseKey, callAI, extractJSON } from '@/lib/ai';
import { getResumeParserPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string) ?? 'My Resume';
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  let rawText = '';

  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    rawText = (await mammoth.extractRawText({ buffer })).value;
  } else {
    const pdfParse = (await import('pdf-parse')).default;
    rawText = (await pdfParse(buffer)).text;
  }

  const warning = rawText.length < 200;
  const truncated = rawText.slice(0, 8000);

  const keys = await getUserKeys(userId);
  const keyInfo = getParseKey(keys);
  if (!keyInfo) return NextResponse.json({ error: 'No API key configured. Add your key in Settings.' }, { status: 400 });

  const raw = await callAI(keyInfo, getResumeParserPrompt(truncated), {
    temperature: 0.1,
    maxTokens: 2000,
    timeoutMs: 52000,
  });

  const parsedData = extractJSON(raw);

  const supabase = createServerClient();
  await supabase.from('users').upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });

  const { data, error } = await supabase.from('resumes').insert({
    user_id: userId,
    title,
    raw_text: rawText,
    personal_info: parsedData.personal ?? {},
    summary: parsedData.summary ?? '',
    experience: parsedData.experience ?? [],
    education: parsedData.education ?? [],
    skills: parsedData.skills ?? [],
    certifications: parsedData.certifications ?? [],
    languages: parsedData.languages ?? [],
    projects: parsedData.projects ?? [],
    achievements: parsedData.achievements ?? [],
    volunteer: parsedData.volunteer ?? [],
    publications: parsedData.publications ?? [],
    awards: parsedData.awards ?? [],
    interests: parsedData.interests ?? [],
    is_master: true,
  }).select('id').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, parsedData, warning });
}
