export const maxDuration = 60;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { WRITE_KEY } from '@/lib/nvidia';
import { getATSScorePrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobDescription } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const supabase = createServerClient();
  const { data: row } = await supabase.from('resumes').select('*').eq('id', resumeId).eq('user_id', userId).single();
  if (!row) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  const resumeJson = JSON.stringify(row.parsed_data ?? {});

  const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WRITE_KEY}` },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [{ role: 'user', content: getATSScorePrompt(resumeJson, jobDescription) }],
      temperature: 0.1,
      max_tokens: 2000,
      stream: false,
    }),
    signal: AbortSignal.timeout(50000),
  });

  if (!nvidiaRes.ok) return NextResponse.json({ error: `AI error: ${await nvidiaRes.text()}` }, { status: 500 });

  const json = await nvidiaRes.json();
  const raw = json.choices?.[0]?.message?.content ?? '{}';

  let breakdown: any = {};
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    breakdown = JSON.parse(match ? match[0] : raw);
  } catch { breakdown = {}; }

  return NextResponse.json({ breakdown });
}
