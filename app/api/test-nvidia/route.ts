import { NextResponse } from 'next/server';
import { FALLBACK_KEY } from '@/lib/nvidia';

export async function GET() {
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
      headers: { Authorization: `Bearer ${FALLBACK_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return NextResponse.json({ ok: res.ok, status: res.status, models: data?.data?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, code: e.cause?.code });
  }
}
