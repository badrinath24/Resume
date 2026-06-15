import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { nvidiaApiKey } = await req.json();
  const supabase = createServerClient();
  await supabase.from('users').update({ nvidia_api_key: nvidiaApiKey }).eq('id', userId);
  return NextResponse.json({ success: true });
}
