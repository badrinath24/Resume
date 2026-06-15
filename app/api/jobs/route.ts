import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerClient();
  const { data: applications, error } = await supabase.from('applications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { jobTitle, company, jobUrl, jobDescription } = await req.json();
  const supabase = createServerClient();
  const { data, error } = await supabase.from('applications').insert({ user_id: userId, job_title: jobTitle, company, job_url: jobUrl ?? '', job_description: jobDescription ?? '', status: 'saved' }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ application: data });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const supabase = createServerClient();
  const { data, error } = await supabase.from('applications').update({ status }).eq('id', id).eq('user_id', userId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ application: data });
}
