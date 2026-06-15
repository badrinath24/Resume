import { createServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

function Harvard({ resume }: { resume: any }) {
  const p = resume.personal_info ?? {};
  const exp: any[] = resume.experience ?? [];
  const edu: any[] = resume.education ?? [];
  const skills: any[] = resume.skills ?? [];
  const certs: any[] = resume.certifications ?? [];
  const langs: any[] = resume.languages ?? [];
  const projects: any[] = resume.projects ?? [];
  const achievements: any[] = resume.achievements ?? [];
  const publications: any[] = resume.publications ?? [];

  const S = {
    page: { fontFamily: 'Times New Roman, Georgia, serif', fontSize: '10.5pt', color: '#000', maxWidth: 780, margin: '0 auto', padding: '32px 48px' } as React.CSSProperties,
    name: { textAlign: 'center' as const, fontSize: '16pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 },
    contact: { textAlign: 'center' as const, fontSize: '9.5pt', color: '#222', marginBottom: 2 },
    jobTitle: { textAlign: 'center' as const, fontSize: '10pt', color: '#222', marginBottom: 18 },
    sectionHead: { fontWeight: 700, fontSize: '10.5pt', textTransform: 'uppercase' as const, letterSpacing: 0.5, borderBottom: '1px solid #000', paddingBottom: 2, marginTop: 14, marginBottom: 6 },
    skillRow: { fontSize: '10pt', lineHeight: 1.55, marginBottom: 3 } as React.CSSProperties,
    expRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 } as React.CSSProperties,
    jobTitle2: { fontWeight: 700, fontSize: '10.5pt' } as React.CSSProperties,
    company: { fontWeight: 400, fontSize: '10.5pt' } as React.CSSProperties,
    dates: { fontSize: '10pt', color: '#000', whiteSpace: 'nowrap' as const },
    bullet: { fontSize: '10pt', lineHeight: 1.55, marginBottom: 2, paddingLeft: 0 },
    eduInst: { fontWeight: 700, fontSize: '10.5pt' } as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      {/* Header */}
      {p.name && <div style={S.name}>{p.name}</div>}
      <div style={S.contact}>
        {[p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(' | ')}
      </div>
      {resume.title && <div style={S.jobTitle}>{resume.title}</div>}

      {/* Summary */}
      {resume.summary && (
        <>
          <div style={S.sectionHead}>Summary</div>
          <p style={{ fontSize: '10pt', lineHeight: 1.6 }}>{resume.summary}</p>
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <div style={S.sectionHead}>Skills</div>
          {skills.map((sg: any, i: number) => (
            <div key={i} style={S.skillRow}>
              <span style={{ fontWeight: 700 }}>{sg.category}:</span>{' '}
              <span>{(sg.items ?? []).join(', ')}</span>
            </div>
          ))}
        </>
      )}

      {/* Work Experience */}
      {exp.length > 0 && (
        <>
          <div style={S.sectionHead}>Work Experience</div>
          {exp.map((e: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={S.expRow}>
                <div>
                  <span style={S.jobTitle2}>{e.title}</span>
                  {e.company && <span style={S.company}>{e.title ? ` (${e.company})` : e.company}</span>}
                </div>
                <span style={S.dates}>{e.startDate}{e.endDate ? ` - ${e.endDate}` : ''}</span>
              </div>
              {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => (
                <div key={j} style={S.bullet}>• {b}</div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <div style={S.sectionHead}>Projects</div>
          {projects.map((proj: any, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: '10.5pt', marginBottom: 2 }}>{proj.name}</div>
              {(proj.bullets ?? []).map((b: string, j: number) => (
                <div key={j} style={S.bullet}>• {b}</div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {edu.length > 0 && (
        <>
          <div style={S.sectionHead}>Education</div>
          {edu.map((e: any, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' } as React.CSSProperties}>
                <span style={S.eduInst}>{e.school}</span>
                <span style={{ fontSize: '10pt' }}>{e.location ?? ''}</span>
              </div>
              <div style={{ fontSize: '10pt' }}>{e.degree}</div>
              {e.grade && <div style={{ fontSize: '10pt' }}>• {e.grade}</div>}
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <>
          <div style={S.sectionHead}>Certifications</div>
          {certs.map((c: any, i: number) => (
            <div key={i} style={S.bullet}>• {c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.date ? ` (${c.date})` : ''}</div>
          ))}
        </>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <>
          <div style={S.sectionHead}>Achievements</div>
          {achievements.map((a: any, i: number) => (
            <div key={i} style={S.bullet}>• {typeof a === 'string' ? a : a.title ?? JSON.stringify(a)}</div>
          ))}
        </>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <>
          <div style={S.sectionHead}>Publications</div>
          {publications.map((pub: any, i: number) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: '10.5pt' }}>{typeof pub === 'string' ? pub : pub.title}</div>
              {pub.description && <div style={{ fontSize: '10pt' }}>{pub.description}</div>}
            </div>
          ))}
        </>
      )}

      {/* Languages */}
      {langs.length > 0 && (
        <>
          <div style={S.sectionHead}>Languages</div>
          <div style={{ fontSize: '10pt' }}>{langs.map((l: any) => `${l.language} (${l.proficiency})`).join(' | ')}</div>
        </>
      )}
    </div>
  );
}

function Modern({ resume }: { resume: any }) {
  const p = resume.personal_info ?? {};
  const exp: any[] = resume.experience ?? [];
  const edu: any[] = resume.education ?? [];
  const skills: any[] = resume.skills ?? [];
  const certs: any[] = resume.certifications ?? [];
  const langs: any[] = resume.languages ?? [];
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10.5pt', color: '#111', maxWidth: 780, margin: '0 auto', padding: '32px 40px' }}>
      {p.name && <h1 style={{ fontSize: '24pt', fontWeight: 700, color: '#1a56db', marginBottom: 4 }}>{p.name}</h1>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '9pt', color: '#555', marginBottom: 20 }}>
        {p.email && <span>{p.email}</span>}{p.phone && <span>• {p.phone}</span>}{p.location && <span>• {p.location}</span>}{p.linkedin && <span>• {p.linkedin}</span>}
      </div>
      {resume.summary && <><div style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: 3, marginBottom: 8 }}>Summary</div><p style={{ fontSize: '10pt', color: '#444', lineHeight: 1.6, marginBottom: 18 }}>{resume.summary}</p></>}
      {exp.length > 0 && <><div style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: 3, marginBottom: 10 }}>Experience</div>{exp.map((e, i) => (<div key={i} style={{ marginBottom: 12 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><span style={{ fontWeight: 700 }}>{e.title}</span><span style={{ color: '#555' }}> · {e.company}{e.location ? ` · ${e.location}` : ''}</span></div><span style={{ fontSize: '9pt', color: '#888' }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div><ul style={{ paddingLeft: 16, marginTop: 4 }}>{(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ fontSize: '10pt', color: '#444', lineHeight: 1.5, marginBottom: 2 }}>{b}</li>)}</ul></div>))}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
        {skills.length > 0 && <div><div style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: 3, marginBottom: 8 }}>Skills</div>{skills.map((sg, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: '10pt' }}><span style={{ fontWeight: 700, minWidth: 100 }}>{sg.category}:</span><span style={{ color: '#444' }}>{(sg.items ?? []).join(', ')}</span></div>)}</div>}
        {edu.length > 0 && <div><div style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: 3, marginBottom: 8 }}>Education</div>{edu.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700 }}>{e.degree}</span><span style={{ fontSize: '9pt', color: '#888' }}>{e.endDate}</span></div><div style={{ color: '#555' }}>{e.school}</div></div>)}</div>}
      </div>
      {certs.length > 0 && <><div style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: 3, marginTop: 16, marginBottom: 8 }}>Certifications</div>{certs.map((c, i) => <div key={i} style={{ marginBottom: 6 }}><span style={{ fontWeight: 700 }}>{c.name}</span> <span style={{ color: '#666', fontSize: '9pt' }}>· {c.issuer}{c.date ? ` · ${c.date}` : ''}</span></div>)}</>}
      {langs.length > 0 && <><div style={{ fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: 3, marginTop: 16, marginBottom: 8 }}>Languages</div><div style={{ display: 'flex', gap: 16 }}>{langs.map((l, i) => <span key={i} style={{ fontSize: '10pt' }}>{l.language} <span style={{ color: '#888' }}>({l.proficiency})</span></span>)}</div></>}
    </div>
  );
}

function Classic({ resume }: { resume: any }) {
  const p = resume.personal_info ?? {};
  const exp: any[] = resume.experience ?? [];
  const edu: any[] = resume.education ?? [];
  const skills: any[] = resume.skills ?? [];
  const certs: any[] = resume.certifications ?? [];
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '10.5pt', color: '#111', maxWidth: 780, margin: '0 auto', padding: '32px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '2px solid #111', paddingBottom: 16 }}>
        {p.name && <h1 style={{ fontSize: '26pt', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{p.name}</h1>}
        <div style={{ fontSize: '9pt', color: '#555', display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {p.email && <span>{p.email}</span>}{p.phone && <span>| {p.phone}</span>}{p.location && <span>| {p.location}</span>}{p.linkedin && <span>| {p.linkedin}</span>}
        </div>
      </div>
      {resume.summary && <><p style={{ fontStyle: 'italic', color: '#444', lineHeight: 1.7, marginBottom: 18, textAlign: 'center' }}>{resume.summary}</p></>}
      {exp.length > 0 && <><div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: '9.5pt', borderBottom: '1px solid #111', paddingBottom: 2, marginBottom: 10 }}>Professional Experience</div>{exp.map((e, i) => (<div key={i} style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><span style={{ fontWeight: 700, fontSize: '11pt' }}>{e.title}</span><span style={{ color: '#555' }}>, {e.company}{e.location ? `, ${e.location}` : ''}</span></div><span style={{ fontStyle: 'italic', color: '#888', fontSize: '9.5pt' }}>{e.startDate} – {e.endDate}</span></div><ul style={{ paddingLeft: 18, marginTop: 4 }}>{(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.6, marginBottom: 2, color: '#333' }}>{b}</li>)}</ul></div>))}</>}
      {edu.length > 0 && <><div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: '9.5pt', borderBottom: '1px solid #111', paddingBottom: 2, marginTop: 16, marginBottom: 10 }}>Education</div>{edu.map((e, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><div><span style={{ fontWeight: 700 }}>{e.degree}</span> — <span style={{ color: '#555' }}>{e.school}</span></div><span style={{ fontStyle: 'italic', color: '#888', fontSize: '9.5pt' }}>{e.endDate}</span></div>)}</>}
      {skills.length > 0 && <><div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: '9.5pt', borderBottom: '1px solid #111', paddingBottom: 2, marginTop: 16, marginBottom: 10 }}>Skills</div><div style={{ columns: 2, gap: 24 }}>{skills.map((sg, i) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{sg.category}: </span><span style={{ color: '#444' }}>{(sg.items ?? []).join(', ')}</span></div>)}</div></>}
      {certs.length > 0 && <><div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: '9.5pt', borderBottom: '1px solid #111', paddingBottom: 2, marginTop: 16, marginBottom: 10 }}>Certifications</div>{certs.map((c, i) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{c.name}</span> <span style={{ color: '#666', fontSize: '9.5pt' }}>· {c.issuer}</span></div>)}</>}
    </div>
  );
}

function Minimal({ resume }: { resume: any }) {
  const p = resume.personal_info ?? {};
  const exp: any[] = resume.experience ?? [];
  const edu: any[] = resume.education ?? [];
  const skills: any[] = resume.skills ?? [];
  const certs: any[] = resume.certifications ?? [];
  return (
    <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '10pt', color: '#222', maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
      {p.name && <h1 style={{ fontSize: '28pt', fontWeight: 300, letterSpacing: -1, marginBottom: 6, color: '#111' }}>{p.name}</h1>}
      <div style={{ fontSize: '9pt', color: '#777', display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}{p.linkedin && <span>{p.linkedin}</span>}
      </div>
      {resume.summary && <p style={{ fontSize: '10.5pt', color: '#444', lineHeight: 1.7, marginBottom: 28, maxWidth: 600 }}>{resume.summary}</p>}
      {exp.length > 0 && <><div style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginBottom: 12 }}>Experience</div>{exp.map((e, i) => (<div key={i} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '2px solid #e5e7eb' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{e.title} <span style={{ color: '#777', fontWeight: 400 }}>@ {e.company}</span></span><span style={{ fontSize: '8.5pt', color: '#999' }}>{e.startDate} – {e.endDate}</span></div><ul style={{ paddingLeft: 14, marginTop: 4 }}>{(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ fontSize: '9.5pt', color: '#555', lineHeight: 1.6, marginBottom: 2 }}>{b}</li>)}</ul></div>))}</>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 16 }}>
        {skills.length > 0 && <div><div style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginBottom: 10 }}>Skills</div>{skills.map((sg, i) => <div key={i} style={{ marginBottom: 5 }}><div style={{ fontSize: '8.5pt', fontWeight: 700, color: '#555', marginBottom: 1 }}>{sg.category}</div><div style={{ fontSize: '9.5pt', color: '#444' }}>{(sg.items ?? []).join(' · ')}</div></div>)}</div>}
        {edu.length > 0 && <div><div style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginBottom: 10 }}>Education</div>{edu.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 600 }}>{e.degree}</div><div style={{ color: '#777', fontSize: '9.5pt' }}>{e.school} · {e.endDate}</div></div>)}</div>}
      </div>
      {certs.length > 0 && <><div style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginTop: 20, marginBottom: 10 }}>Certifications</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{certs.map((c, i) => <span key={i} style={{ background: '#f3f4f6', borderRadius: 6, padding: '3px 10px', fontSize: '9pt', color: '#444' }}>{c.name}</span>)}</div></>}
    </div>
  );
}

function Professional({ resume }: { resume: any }) {
  const p = resume.personal_info ?? {};
  const exp: any[] = resume.experience ?? [];
  const edu: any[] = resume.education ?? [];
  const skills: any[] = resume.skills ?? [];
  const certs: any[] = resume.certifications ?? [];
  const langs: any[] = resume.languages ?? [];
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', color: '#111', maxWidth: 780, margin: '0 auto' }}>
      {/* Dark header */}
      <div style={{ background: '#065f46', color: 'white', padding: '28px 40px 24px' }}>
        {p.name && <h1 style={{ fontSize: '24pt', fontWeight: 700, marginBottom: 6, color: 'white' }}>{p.name}</h1>}
        <div style={{ fontSize: '9pt', color: '#a7f3d0', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {p.email && <span>{p.email}</span>}{p.phone && <span>• {p.phone}</span>}{p.location && <span>• {p.location}</span>}{p.linkedin && <span>• {p.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: '24px 40px' }}>
        {resume.summary && <><div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#065f46', borderBottom: '1.5px solid #065f46', paddingBottom: 3, marginBottom: 8 }}>Profile</div><p style={{ color: '#444', lineHeight: 1.65, marginBottom: 18 }}>{resume.summary}</p></>}
        {exp.length > 0 && <><div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#065f46', borderBottom: '1.5px solid #065f46', paddingBottom: 3, marginBottom: 10 }}>Experience</div>{exp.map((e, i) => (<div key={i} style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', background: '#f0fdf4', padding: '5px 8px', borderRadius: 4, marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{e.title} <span style={{ color: '#065f46' }}>@ {e.company}</span></span><span style={{ fontSize: '9pt', color: '#6b7280' }}>{e.startDate} – {e.endDate}</span></div><ul style={{ paddingLeft: 16 }}>{(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.55, marginBottom: 2, color: '#333' }}>{b}</li>)}</ul></div>))}</>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 4 }}>
          {skills.length > 0 && <div><div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#065f46', borderBottom: '1.5px solid #065f46', paddingBottom: 3, marginBottom: 8 }}>Skills</div>{skills.map((sg, i) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700, fontSize: '9.5pt' }}>{sg.category}: </span><span style={{ color: '#444', fontSize: '9.5pt' }}>{(sg.items ?? []).join(', ')}</span></div>)}</div>}
          {edu.length > 0 && <div><div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#065f46', borderBottom: '1.5px solid #065f46', paddingBottom: 3, marginBottom: 8 }}>Education</div>{edu.map((e, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 700 }}>{e.degree}</div><div style={{ color: '#555' }}>{e.school}</div><div style={{ fontSize: '9pt', color: '#888' }}>{e.endDate}{e.grade ? ` · ${e.grade}` : ''}</div></div>)}</div>}
        </div>
        {certs.length > 0 && <><div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#065f46', borderBottom: '1.5px solid #065f46', paddingBottom: 3, marginTop: 16, marginBottom: 8 }}>Certifications</div>{certs.map((c, i) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{c.name}</span> <span style={{ color: '#666', fontSize: '9pt' }}>· {c.issuer}{c.date ? ` · ${c.date}` : ''}</span></div>)}</>}
        {langs.length > 0 && <><div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#065f46', borderBottom: '1.5px solid #065f46', paddingBottom: 3, marginTop: 16, marginBottom: 8 }}>Languages</div><div style={{ display: 'flex', gap: 16 }}>{langs.map((l, i) => <span key={i}>{l.language} <span style={{ color: '#888' }}>({l.proficiency})</span></span>)}</div></>}
      </div>
    </div>
  );
}

export default async function PrintResumePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ template?: string }> }) {
  const { userId } = await auth();
  if (!userId) notFound();

  const { id } = await params;
  const { template = 'modern' } = await searchParams;

  const supabase = createServerClient();
  const { data: resume } = await supabase.from('resumes').select('*').eq('id', id).single();
  if (!resume) notFound();

  const templates: Record<string, React.ReactNode> = {
    harvard: <Harvard resume={resume} />,
    modern: <Modern resume={resume} />,
    classic: <Classic resume={resume} />,
    minimal: <Minimal resume={resume} />,
    professional: <Professional resume={resume} />,
  };

  const content = templates[template] ?? templates.modern;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f9fafb; }
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          @page { margin: 12mm 15mm; size: A4; }
        }
        .no-print { position: fixed; bottom: 24px; right: 24px; display: flex; gap: 10px; z-index: 999; }
        .btn-print { background: #1a56db; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-back { background: white; color: #374151; border: 1px solid #d1d5db; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; }
      `}</style>

      <div style={{ background: '#f9fafb', minHeight: '100vh', paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: 8, maxWidth: 820, margin: '0 auto' }}>
          {content}
        </div>
      </div>

      <div className="no-print">
        <button className="btn-back" id="backBtn">← Back</button>
        <button className="btn-print" id="printBtn">⬇️ Save as PDF</button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('printBtn').onclick = () => window.print(); document.getElementById('backBtn').onclick = () => history.back();` }} />
    </>
  );
}
