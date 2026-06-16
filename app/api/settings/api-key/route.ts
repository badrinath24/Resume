import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerClient();
  const { data } = await supabase
    .from('users')
    .select('nvidia_api_key, nvidia_write_key, openai_api_key, groq_api_key')
    .eq('id', userId)
    .single();
  return NextResponse.json({ keys: data ?? {} });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const supabase = createServerClient();
  await supabase.from('users').upsert({
    id: userId,
    nvidia_api_key:   body.nvidia_api_key   ?? null,
    nvidia_write_key: body.nvidia_write_key ?? null,
    openai_api_key:   body.openai_api_key   ?? null,
    groq_api_key:     body.groq_api_key     ?? null,
  }, { onConflict: 'id' });
  return NextResponse.json({ success: true });
}
