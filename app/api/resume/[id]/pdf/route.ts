export const maxDuration = 60;

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createServerClient();
  const { data: resume, error } = await supabase.from('resumes').select('*').eq('id', id).single();
  if (error || !resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const ReactModule = await import('react');
    const React = ReactModule.default ?? ReactModule;
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { ResumePDF } = await import('@/lib/resumePdf');

    const element = React.createElement(ResumePDF as any, { resume });
    const buffer = await renderToBuffer(element as any);

    const filename = `${(resume.title ?? 'resume').replace(/[^a-z0-9]/gi, '_')}.pdf`;
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    console.error('PDF error:', e?.message);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
