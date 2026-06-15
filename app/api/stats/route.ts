import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ resumes: 0, applications: 0 });

  const supabase = createServerClient();
  const [{ count: resumes }, { count: applications }] = await Promise.all([
    supabase.from('resumes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('user_id', userId),
  ]);

  return NextResponse.json({ resumes: resumes ?? 0, applications: applications ?? 0 });
}
