import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ resumes: [] });

  const supabase = createServerClient();
  const { data } = await supabase
    .from('resumes')
    .select('id, title, is_master, created_at, personal_info')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return NextResponse.json({ resumes: data ?? [] });
}
