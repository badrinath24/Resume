import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerClient();
  const { data, error } = await supabase.from('resumes').select('*').eq('id', params.id).eq('user_id', userId).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ resume: { id: data.id, userId: data.user_id, title: data.title, rawText: data.raw_text, personalInfo: data.personal_info, summary: data.summary, experience: data.experience, education: data.education, skills: data.skills, certifications: data.certifications, languages: data.languages, fileUrl: data.file_url, isMaster: data.is_master, createdAt: data.created_at, updatedAt: data.updated_at } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const supabase = createServerClient();
  const { data, error } = await supabase.from('resumes').update({ title: body.title, personal_info: body.personalInfo, summary: body.summary, experience: body.experience, education: body.education, skills: body.skills, certifications: body.certifications, languages: body.languages, updated_at: new Date().toISOString() }).eq('id', params.id).eq('user_id', userId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, resume: data });
}
