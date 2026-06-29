export const maxDuration = 60;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserKeys, getParseKey, getWriteKey, callAI, extractJSON } from '@/lib/ai';
import { getJobParserPrompt, getTailoringPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resumeId, jobDescription, jobTitle, company, tailoringLevel = 'MEDIUM' } = await req.json();
  if (!resumeId || !jobDescription) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const keys = await getUserKeys(userId);
  const parseKey = getParseKey(keys);
  const writeKey = getWriteKey(keys);
  if (!parseKey || !writeKey) return NextResponse.json({ error: 'No API key configured. Add your key in Settings.' }, { status: 400 });

  const supabase = createServerClient();
  const { data: resume, error: resumeErr } = await supabase
    .from('resumes').select('*').eq('id', resumeId).single();
  if (resumeErr || !resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

  // Step 1: Parse job description
  const jobRaw = await callAI(parseKey, getJobParserPrompt(jobDescription.slice(0, 4000)), {
    temperature: 0.1,
    maxTokens: 1000,
    timeoutMs: 25000,
  });
  let jobData: any = extractJSON(jobRaw);
  if (!jobData?.jobTitle) jobData = { jobTitle, company, keywords: [] };

  // Step 2: Tailor resume
  const resumeJson = JSON.stringify({
    personal: resume.personal_info,
    summary: resume.summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    certifications: resume.certifications,
    languages: resume.languages,
    projects: resume.projects ?? [],
    achievements: resume.achievements ?? [],
    volunteer: resume.volunteer ?? [],
    publications: resume.publications ?? [],
    awards: resume.awards ?? [],
    interests: resume.interests ?? [],
  });
  const tailorRaw = await callAI(writeKey, getTailoringPrompt(resumeJson, JSON.stringify(jobData), tailoringLevel), {
    temperature: 0.2,
    maxTokens: 4000,
    timeoutMs: 50000,
    isWriting: true,
  });
  const tailorData: any = extractJSON(tailorRaw);

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
    projects: tailorData.tailoredResume?.projects ?? resume.projects ?? [],
    achievements: tailorData.tailoredResume?.achievements ?? resume.achievements ?? [],
    volunteer: resume.volunteer ?? [],
    publications: resume.publications ?? [],
    awards: resume.awards ?? [],
    interests: resume.interests ?? [],
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
