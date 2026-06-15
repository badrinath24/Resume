export const maxDuration = 180;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { PARSE_KEY, WRITE_KEY } from '@/lib/nvidia';
import { getJobParserPrompt, getTailoringPrompt } from '@/lib/prompts';

const FAST_MODEL = 'qwen/qwen3-next-80b-a3b-instruct';   // parsing — fast sparse MoE
const SMART_MODEL = 'meta/llama-3.3-70b-instruct';        // writing — best Llama for generation

async function callNvidia(prompt: string, model: string, maxTokens = 3000): Promise<string> {
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${model === FAST_MODEL ? PARSE_KEY : WRITE_KEY}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: maxTokens,
      stream: false,
    }),
    signal: AbortSignal.timeout(55000),
  });
  if (!res.ok) throw new Error(`NVIDIA ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? '{}';
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobDescription, jobTitle, company, tailoringLevel = 'MEDIUM' } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = createServerClient();
  const { data: resume, error: resumeErr } = await supabase
    .from('resumes').select('*').eq('id', resumeId).single();
  if (resumeErr || !resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  // Step 1: Parse job description (fast model, small output)
  const jobRaw = await callNvidia(getJobParserPrompt(jobDescription.slice(0, 4000)), FAST_MODEL, 1500);
  let jobData: any = {};
  try { jobData = JSON.parse(jobRaw.trim()); } catch { jobData = { jobTitle, company, keywords: [] }; }

  // Step 2: Tailor resume (smart model)
  const resumeJson = JSON.stringify({
    personal: resume.personal_info,
    summary: resume.summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    certifications: resume.certifications,
    languages: resume.languages,
  });
  const tailorRaw = await callNvidia(getTailoringPrompt(resumeJson, JSON.stringify(jobData), tailoringLevel), SMART_MODEL, 4000);
  let tailorData: any = {};
  try { tailorData = JSON.parse(tailorRaw.trim()); } catch { tailorData = {}; }

  await supabase.from('users').upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });

  const { data: tailoredResume } = await supabase.from('resumes').insert({
    user_id: userId,
    title: `${jobData.jobTitle ?? jobTitle} @ ${jobData.company ?? company}`,
    raw_text: resume.raw_text,
    personal_info: tailorData.tailoredResume?.personal ?? resume.personal_info,
    summary: tailorData.tailoredResume?.summary ?? resume.summary,
    experience: tailorData.tailoredResume?.experience ?? resume.experience,
    education: tailorData.tailoredResume?.education ?? resume.education,
    skills: tailorData.tailoredResume?.skills ?? resume.skills,
    certifications: tailorData.tailoredResume?.certifications ?? resume.certifications,
    languages: tailorData.tailoredResume?.languages ?? resume.languages,
    is_master: false,
  }).select('id').single();

  const { data: application } = await supabase.from('applications').insert({
    user_id: userId,
    job_title: jobData.jobTitle ?? jobTitle,
    company: jobData.company ?? company,
    job_description: jobDescription,
    tailored_resume_id: tailoredResume?.id ?? null,
    ats_score: tailorData.atsScore ?? 0,
    score_breakdown: tailorData.changes ?? {},
    status: 'saved',
  }).select('id').single();

  return NextResponse.json({
    applicationId: application?.id,
    tailoredResumeId: tailoredResume?.id,
    atsScore: tailorData.atsScore ?? 0,
    changes: tailorData.changes ?? [],
    matchedKeywords: tailorData.matchedKeywords ?? [],
    missingKeywords: tailorData.missingKeywords ?? [],
    jobData,
  });
}
