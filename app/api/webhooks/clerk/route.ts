import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  let event: any;
  try { event = JSON.parse(body); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const supabase = createServerClient();

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses?.[0]?.email_address ?? '';
    const name = [first_name, last_name].filter(Boolean).join(' ');
    await supabase.from('users').insert({ id, email, name });
  }

  if (event.type === 'user.deleted') {
    await supabase.from('users').delete().eq('id', event.data.id);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
