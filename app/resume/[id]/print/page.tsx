import { createServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

function ContactLine({ p }: { p: any }) {
  return [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).join(' | ');
}

function Harvard({ r }: { r: any }) {
  const p = r.personal_info ?? {};
  const exp: any[] = r.experience ?? [];
  const edu: any[] = r.education ?? [];
  const skills: any[] = r.skills ?? [];
  const certs: any[] = r.certifications ?? [];
  const langs: any[] = r.languages ?? [];
  const projects: any[] = r.projects ?? [];
  const achievements: any[] = [...(r.achievements ?? []), ...(r.awards ?? [])];
  const volunteer: any[] = r.volunteer ?? [];
  const publications: any[] = r.publications ?? [];
  const interests: any[] = r.interests ?? [];

  const S = {
    page: { fontFamily: 'Times New Roman, Georgia, serif', fontSize: '10.5pt', color: '#000', maxWidth: 780, margin: '0 auto', padding: '32px 48px' } as React.CSSProperties,
    name: { textAlign: 'center' as const, fontSize: '18pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 4 },
    contact: { textAlign: 'center' as const, fontSize: '9.5pt', color: '#222', marginBottom: 16 },
    h: { fontWeight: 700, fontSize: '10.5pt', textTransform: 'uppercase' as const, letterSpacing: 0.5, borderBottom: '1px solid #000', paddingBottom: 2, marginTop: 14, marginBottom: 6 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 } as React.CSSProperties,
    bullet: { fontSize: '10pt', lineHeight: 1.55, marginBottom: 2 },
  };

  return (
    <div style={S.page}>
      {p.name && <div style={S.name}>{p.name}</div>}
      <div style={S.contact}><ContactLine p={p} /></div>

      {r.summary && <><div style={S.h}>Summary</div><p style={{ fontSize: '10pt', lineHeight: 1.65, marginBottom: 4 }}>{r.summary}</p></>}

      {skills.length > 0 && (
        <><div style={S.h}>Skills</div>
        {skills.map((sg: any, i: number) => (
          <div key={i} style={{ fontSize: '10pt', lineHeight: 1.55, marginBottom: 3 }}>
            <span style={{ fontWeight: 700 }}>{sg.category}: </span><span>{(sg.items ?? []).join(', ')}</span>
          </div>
        ))}</>
      )}

      {exp.length > 0 && (
        <><div style={S.h}>Work Experience</div>
        {exp.map((e: any, i: number) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={S.row}>
              <div><span style={{ fontWeight: 700 }}>{e.title}</span>{e.company && <span> — {e.company}</span>}{e.location && <span>, {e.location}</span>}</div>
              <span style={{ fontSize: '10pt', whiteSpace: 'nowrap' as const }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
            </div>
            {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => (
              <div key={j} style={S.bullet}>• {b}</div>
            ))}
          </div>
        ))}</>
      )}

      {projects.length > 0 && (
        <><div style={S.h}>Projects</div>
        {projects.map((proj: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={S.row}>
              <div><span style={{ fontWeight: 700 }}>{proj.name}</span>{proj.tech?.length > 0 && <span style={{ fontSize: '9.5pt', color: '#444' }}> — {proj.tech.join(', ')}</span>}</div>
              {(proj.startDate || proj.endDate) && <span style={{ fontSize: '10pt', whiteSpace: 'nowrap' as const }}>{proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}</span>}
            </div>
            {proj.description && <div style={{ fontSize: '10pt', color: '#333', marginBottom: 2 }}>{proj.description}</div>}
            {(proj.bullets ?? []).map((b: string, j: number) => <div key={j} style={S.bullet}>• {b}</div>)}
            {proj.url && <div style={{ fontSize: '9.5pt', color: '#555' }}>{proj.url}</div>}
          </div>
        ))}</>
      )}

      {edu.length > 0 && (
        <><div style={S.h}>Education</div>
        {edu.map((e: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={S.row}>
              <span style={{ fontWeight: 700 }}>{e.school}</span>
              <span style={{ fontSize: '10pt' }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
            </div>
            <div style={{ fontSize: '10pt' }}>{e.degree}{e.location ? `, ${e.location}` : ''}</div>
            {e.grade && <div style={{ fontSize: '10pt' }}>GPA/Grade: {e.grade}</div>}
            {e.honors && <div style={{ fontSize: '10pt' }}>{e.honors}</div>}
          </div>
        ))}</>
      )}

      {volunteer.length > 0 && (
        <><div style={S.h}>Volunteer Experience</div>
        {volunteer.map((v: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={S.row}>
              <div><span style={{ fontWeight: 700 }}>{v.role}</span>{v.organisation && <span> — {v.organisation}</span>}</div>
              <span style={{ fontSize: '10pt', whiteSpace: 'nowrap' as const }}>{v.startDate}{v.endDate ? ` – ${v.endDate}` : ''}</span>
            </div>
            {(v.bullets ?? []).map((b: string, j: number) => <div key={j} style={S.bullet}>• {b}</div>)}
          </div>
        ))}</>
      )}

      {certs.length > 0 && (
        <><div style={S.h}>Certifications</div>
        {certs.map((c: any, i: number) => (
          <div key={i} style={S.bullet}>• <span style={{ fontWeight: 700 }}>{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ''}{c.date ? ` (${c.date})` : ''}{c.url ? ` | ${c.url}` : ''}</div>
        ))}</>
      )}

      {publications.length > 0 && (
        <><div style={S.h}>Publications</div>
        {publications.map((pub: any, i: number) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>{typeof pub === 'string' ? pub : pub.title}</span>
            {pub.journal && <span style={{ fontSize: '9.5pt', color: '#555' }}> — {pub.journal}</span>}
            {pub.date && <span style={{ fontSize: '9.5pt', color: '#777' }}> ({pub.date})</span>}
            {pub.url && <div style={{ fontSize: '9.5pt', color: '#555' }}>{pub.url}</div>}
          </div>
        ))}</>
      )}

      {achievements.length > 0 && (
        <><div style={S.h}>Achievements & Awards</div>
        {achievements.map((a: any, i: number) => (
          <div key={i} style={S.bullet}>• {typeof a === 'string' ? a : a.title ?? JSON.stringify(a)}</div>
        ))}</>
      )}

      {langs.length > 0 && (
        <><div style={S.h}>Languages</div>
        <div style={{ fontSize: '10pt' }}>{langs.map((l: any) => `${l.language} (${l.proficiency})`).join(' | ')}</div></>
      )}

      {interests.length > 0 && (
        <><div style={S.h}>Interests</div>
        <div style={{ fontSize: '10pt' }}>{interests.join(' • ')}</div></>
      )}
    </div>
  );
}

function Modern({ r }: { r: any }) {
  const p = r.personal_info ?? {};
  const exp: any[] = r.experience ?? [];
  const edu: any[] = r.education ?? [];
  const skills: any[] = r.skills ?? [];
  const certs: any[] = r.certifications ?? [];
  const langs: any[] = r.languages ?? [];
  const projects: any[] = r.projects ?? [];
  const achievements: any[] = [...(r.achievements ?? []), ...(r.awards ?? [])];
  const volunteer: any[] = r.volunteer ?? [];
  const publications: any[] = r.publications ?? [];
  const interests: any[] = r.interests ?? [];

  const accent = '#ef4444';
  const H = ({ label }: { label: string }) => (
    <div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 16 }}>{label}</div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10.5pt', color: '#111', maxWidth: 780, margin: '0 auto', padding: '32px 40px' }}>
      {p.name && <h1 style={{ fontSize: '24pt', fontWeight: 700, color: accent, marginBottom: 4 }}>{p.name}</h1>}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 10, fontSize: '9pt', color: '#555', marginBottom: 8 }}>
        {[p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).map((v, i) => <span key={i}>{i > 0 ? '• ' : ''}{v}</span>)}
      </div>

      {r.summary && <><H label="Summary" /><p style={{ fontSize: '10pt', color: '#444', lineHeight: 1.65, marginBottom: 4 }}>{r.summary}</p></>}

      {exp.length > 0 && <><H label="Experience" />
        {exp.map((e: any, i: number) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <div><span style={{ fontWeight: 700 }}>{e.title}</span>{e.company && <span style={{ color: '#555' }}> · {e.company}{e.location ? ` · ${e.location}` : ''}</span>}</div>
              <span style={{ fontSize: '9pt', color: '#888', whiteSpace: 'nowrap' as const }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
            </div>
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>
              {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => (
                <li key={j} style={{ fontSize: '10pt', color: '#444', lineHeight: 1.55, marginBottom: 2 }}>{b}</li>
              ))}
            </ul>
          </div>
        ))}</>
      }

      {projects.length > 0 && <><H label="Projects" />
        {projects.map((proj: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <div><span style={{ fontWeight: 700 }}>{proj.name}</span>{proj.tech?.length > 0 && <span style={{ color: accent, fontSize: '9.5pt' }}> [{proj.tech.join(', ')}]</span>}</div>
              {(proj.startDate || proj.endDate) && <span style={{ fontSize: '9pt', color: '#888', whiteSpace: 'nowrap' as const }}>{proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}</span>}
            </div>
            {proj.description && <div style={{ fontSize: '10pt', color: '#555', marginTop: 2 }}>{proj.description}</div>}
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>
              {(proj.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ fontSize: '10pt', color: '#444', lineHeight: 1.5, marginBottom: 2 }}>{b}</li>)}
            </ul>
            {proj.url && <div style={{ fontSize: '9pt', color: '#888', marginTop: 2 }}>{proj.url}</div>}
          </div>
        ))}</>
      }

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 4 }}>
        {skills.length > 0 && <div><H label="Skills" />
          {skills.map((sg: any, i: number) => (
            <div key={i} style={{ marginBottom: 4, fontSize: '10pt' }}><span style={{ fontWeight: 700 }}>{sg.category}: </span><span style={{ color: '#444' }}>{(sg.items ?? []).join(', ')}</span></div>
          ))}
        </div>}
        {edu.length > 0 && <div><H label="Education" />
          {edu.map((e: any, i: number) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' as const }}><span style={{ fontWeight: 700 }}>{e.degree}</span><span style={{ fontSize: '9pt', color: '#888' }}>{e.endDate}</span></div>
              <div style={{ color: '#555' }}>{e.school}</div>
              {e.grade && <div style={{ fontSize: '9pt', color: '#777' }}>Grade: {e.grade}</div>}
            </div>
          ))}
        </div>}
      </div>

      {volunteer.length > 0 && <><H label="Volunteer" />
        {volunteer.map((v: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <div><span style={{ fontWeight: 700 }}>{v.role}</span>{v.organisation && <span style={{ color: '#555' }}> · {v.organisation}</span>}</div>
              <span style={{ fontSize: '9pt', color: '#888', whiteSpace: 'nowrap' as const }}>{v.startDate}{v.endDate ? ` – ${v.endDate}` : ''}</span>
            </div>
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>{(v.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ fontSize: '10pt', color: '#444', lineHeight: 1.5 }}>{b}</li>)}</ul>
          </div>
        ))}</>
      }

      {certs.length > 0 && <><H label="Certifications" />
        {certs.map((c: any, i: number) => (
          <div key={i} style={{ marginBottom: 6 }}><span style={{ fontWeight: 700 }}>{c.name}</span><span style={{ color: '#666', fontSize: '9pt' }}>{c.issuer ? ` · ${c.issuer}` : ''}{c.date ? ` · ${c.date}` : ''}</span></div>
        ))}</>
      }

      {publications.length > 0 && <><H label="Publications" />
        {publications.map((pub: any, i: number) => (
          <div key={i} style={{ marginBottom: 6, fontSize: '10pt' }}>
            <span style={{ fontWeight: 700 }}>{typeof pub === 'string' ? pub : pub.title}</span>
            {pub.journal && <span style={{ color: '#555' }}> — {pub.journal}</span>}
            {pub.date && <span style={{ color: '#888' }}> ({pub.date})</span>}
          </div>
        ))}</>
      }

      {achievements.length > 0 && <><H label="Achievements & Awards" />
        <ul style={{ paddingLeft: 16 }}>{achievements.map((a: any, i: number) => <li key={i} style={{ fontSize: '10pt', color: '#444', lineHeight: 1.55, marginBottom: 2 }}>{typeof a === 'string' ? a : a.title ?? JSON.stringify(a)}</li>)}</ul></>
      }

      {langs.length > 0 && <><H label="Languages" />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>{langs.map((l: any, i: number) => <span key={i} style={{ fontSize: '10pt' }}>{l.language} <span style={{ color: '#888' }}>({l.proficiency})</span></span>)}</div></>
      }

      {interests.length > 0 && <><H label="Interests" />
        <div style={{ fontSize: '10pt', color: '#444' }}>{interests.join(' • ')}</div></>
      }
    </div>
  );
}

function Classic({ r }: { r: any }) {
  const p = r.personal_info ?? {};
  const exp: any[] = r.experience ?? [];
  const edu: any[] = r.education ?? [];
  const skills: any[] = r.skills ?? [];
  const certs: any[] = r.certifications ?? [];
  const langs: any[] = r.languages ?? [];
  const projects: any[] = r.projects ?? [];
  const achievements: any[] = [...(r.achievements ?? []), ...(r.awards ?? [])];
  const volunteer: any[] = r.volunteer ?? [];
  const publications: any[] = r.publications ?? [];
  const interests: any[] = r.interests ?? [];

  const H = ({ label }: { label: string }) => (
    <div style={{ fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 2, fontSize: '9.5pt', borderBottom: '1px solid #111', paddingBottom: 2, marginTop: 16, marginBottom: 10 }}>{label}</div>
  );

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '10.5pt', color: '#111', maxWidth: 780, margin: '0 auto', padding: '32px 40px' }}>
      <div style={{ textAlign: 'center' as const, marginBottom: 20, borderBottom: '2px solid #111', paddingBottom: 16 }}>
        {p.name && <h1 style={{ fontSize: '26pt', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{p.name}</h1>}
        <div style={{ fontSize: '9pt', color: '#555', display: 'flex', justifyContent: 'center' as const, gap: 12, flexWrap: 'wrap' as const }}>
          {[p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).map((v, i) => <span key={i}>{i > 0 ? '| ' : ''}{v}</span>)}
        </div>
      </div>

      {r.summary && <p style={{ fontStyle: 'italic', color: '#444', lineHeight: 1.7, marginBottom: 16, textAlign: 'center' as const }}>{r.summary}</p>}

      {exp.length > 0 && <><H label="Professional Experience" />
        {exp.map((e: any, i: number) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <div><span style={{ fontWeight: 700, fontSize: '11pt' }}>{e.title}</span>{e.company && <span style={{ color: '#555' }}>, {e.company}</span>}{e.location && <span style={{ color: '#555' }}>, {e.location}</span>}</div>
              <span style={{ fontStyle: 'italic', color: '#888', fontSize: '9.5pt', whiteSpace: 'nowrap' as const }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
            </div>
            <ul style={{ paddingLeft: 18, marginTop: 4 }}>
              {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.6, marginBottom: 2, color: '#333' }}>{b}</li>)}
            </ul>
          </div>
        ))}</>
      }

      {projects.length > 0 && <><H label="Projects" />
        {projects.map((proj: any, i: number) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <span style={{ fontWeight: 700 }}>{proj.name}{proj.tech?.length > 0 && <span style={{ fontWeight: 400, fontStyle: 'italic', fontSize: '9.5pt', color: '#555' }}> ({proj.tech.join(', ')})</span>}</span>
              {(proj.startDate || proj.endDate) && <span style={{ fontStyle: 'italic', color: '#888', fontSize: '9.5pt', whiteSpace: 'nowrap' as const }}>{proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}</span>}
            </div>
            {proj.description && <div style={{ fontSize: '10pt', color: '#555', marginTop: 2, fontStyle: 'italic' }}>{proj.description}</div>}
            <ul style={{ paddingLeft: 18, marginTop: 4 }}>
              {(proj.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.6, color: '#333' }}>{b}</li>)}
            </ul>
          </div>
        ))}</>
      }

      {edu.length > 0 && <><H label="Education" />
        {edu.map((e: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' as const, marginBottom: 8 }}>
            <div><span style={{ fontWeight: 700 }}>{e.degree}</span> — <span style={{ color: '#555' }}>{e.school}</span>{e.grade && <span style={{ color: '#777', fontSize: '9.5pt' }}> ({e.grade})</span>}</div>
            <span style={{ fontStyle: 'italic', color: '#888', fontSize: '9.5pt', whiteSpace: 'nowrap' as const }}>{e.endDate}</span>
          </div>
        ))}</>
      }

      {skills.length > 0 && <><H label="Skills" />
        <div style={{ columns: 2, gap: 24 }}>
          {skills.map((sg: any, i: number) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{sg.category}: </span><span style={{ color: '#444' }}>{(sg.items ?? []).join(', ')}</span></div>)}
        </div></>
      }

      {volunteer.length > 0 && <><H label="Volunteer Experience" />
        {volunteer.map((v: any, i: number) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <span style={{ fontWeight: 700 }}>{v.role}{v.organisation && <span style={{ fontWeight: 400 }}>, {v.organisation}</span>}</span>
              <span style={{ fontStyle: 'italic', color: '#888', fontSize: '9.5pt' }}>{v.startDate}{v.endDate ? ` – ${v.endDate}` : ''}</span>
            </div>
            <ul style={{ paddingLeft: 18, marginTop: 4 }}>{(v.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.6, color: '#333' }}>{b}</li>)}</ul>
          </div>
        ))}</>
      }

      {certs.length > 0 && <><H label="Certifications" />
        {certs.map((c: any, i: number) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{c.name}</span><span style={{ color: '#666', fontSize: '9.5pt' }}>{c.issuer ? ` · ${c.issuer}` : ''}{c.date ? ` · ${c.date}` : ''}</span></div>)}</>
      }

      {publications.length > 0 && <><H label="Publications" />
        {publications.map((pub: any, i: number) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>{typeof pub === 'string' ? pub : pub.title}</span>
            {pub.journal && <span style={{ fontStyle: 'italic', color: '#555' }}> — {pub.journal}</span>}
            {pub.date && <span style={{ color: '#777', fontSize: '9.5pt' }}> ({pub.date})</span>}
          </div>
        ))}</>
      }

      {achievements.length > 0 && <><H label="Achievements & Awards" />
        {achievements.map((a: any, i: number) => <div key={i} style={{ marginBottom: 4 }}>• {typeof a === 'string' ? a : a.title}</div>)}</>
      }

      {langs.length > 0 && <><H label="Languages" />
        <div style={{ display: 'flex', gap: 16 }}>{langs.map((l: any, i: number) => <span key={i}>{l.language} <span style={{ color: '#888' }}>({l.proficiency})</span></span>)}</div></>
      }

      {interests.length > 0 && <><H label="Interests" />
        <div style={{ color: '#444' }}>{interests.join(' · ')}</div></>
      }
    </div>
  );
}

function Minimal({ r }: { r: any }) {
  const p = r.personal_info ?? {};
  const exp: any[] = r.experience ?? [];
  const edu: any[] = r.education ?? [];
  const skills: any[] = r.skills ?? [];
  const certs: any[] = r.certifications ?? [];
  const langs: any[] = r.languages ?? [];
  const projects: any[] = r.projects ?? [];
  const achievements: any[] = [...(r.achievements ?? []), ...(r.awards ?? [])];
  const volunteer: any[] = r.volunteer ?? [];
  const publications: any[] = r.publications ?? [];
  const interests: any[] = r.interests ?? [];

  const H = ({ label }: { label: string }) => (
    <div style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 2, color: '#999', marginBottom: 10, marginTop: 24 }}>{label}</div>
  );

  return (
    <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '10pt', color: '#222', maxWidth: 780, margin: '0 auto', padding: '40px 48px' }}>
      {p.name && <h1 style={{ fontSize: '28pt', fontWeight: 300, letterSpacing: -1, marginBottom: 6, color: '#111' }}>{p.name}</h1>}
      <div style={{ fontSize: '9pt', color: '#777', display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 24 }}>
        {[p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
      </div>

      {r.summary && <p style={{ fontSize: '10.5pt', color: '#444', lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>{r.summary}</p>}

      {exp.length > 0 && <><H label="Experience" />
        {exp.map((e: any, i: number) => (
          <div key={i} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '2px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const, marginBottom: 2 }}>
              <span style={{ fontWeight: 600 }}>{e.title} <span style={{ color: '#777', fontWeight: 400 }}>@ {e.company}{e.location ? `, ${e.location}` : ''}</span></span>
              <span style={{ fontSize: '8.5pt', color: '#999', whiteSpace: 'nowrap' as const }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
            </div>
            <ul style={{ paddingLeft: 14, marginTop: 4 }}>
              {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ fontSize: '9.5pt', color: '#555', lineHeight: 1.6, marginBottom: 2 }}>{b}</li>)}
            </ul>
          </div>
        ))}</>
      }

      {projects.length > 0 && <><H label="Projects" />
        {projects.map((proj: any, i: number) => (
          <div key={i} style={{ marginBottom: 14, paddingLeft: 16, borderLeft: '2px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' as const }}>
              <span style={{ fontWeight: 600 }}>{proj.name}{proj.tech?.length > 0 && <span style={{ color: '#999', fontWeight: 400, fontSize: '9pt' }}> — {proj.tech.join(', ')}</span>}</span>
              {(proj.startDate || proj.endDate) && <span style={{ fontSize: '8.5pt', color: '#999', whiteSpace: 'nowrap' as const }}>{proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}</span>}
            </div>
            {proj.description && <div style={{ fontSize: '9.5pt', color: '#666', marginTop: 2 }}>{proj.description}</div>}
            <ul style={{ paddingLeft: 14, marginTop: 4 }}>
              {(proj.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ fontSize: '9.5pt', color: '#555', lineHeight: 1.6 }}>{b}</li>)}
            </ul>
            {proj.url && <div style={{ fontSize: '8.5pt', color: '#aaa', marginTop: 2 }}>{proj.url}</div>}
          </div>
        ))}</>
      }

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 8 }}>
        {skills.length > 0 && <div><H label="Skills" />
          {skills.map((sg: any, i: number) => <div key={i} style={{ marginBottom: 5 }}><div style={{ fontSize: '8.5pt', fontWeight: 700, color: '#555', marginBottom: 1 }}>{sg.category}</div><div style={{ fontSize: '9.5pt', color: '#444' }}>{(sg.items ?? []).join(' · ')}</div></div>)}
        </div>}
        {edu.length > 0 && <div><H label="Education" />
          {edu.map((e: any, i: number) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 600 }}>{e.degree}</div><div style={{ color: '#777', fontSize: '9.5pt' }}>{e.school}{e.endDate ? ` · ${e.endDate}` : ''}</div>{e.grade && <div style={{ fontSize: '8.5pt', color: '#999' }}>Grade: {e.grade}</div>}</div>)}
        </div>}
      </div>

      {volunteer.length > 0 && <><H label="Volunteer" />
        {volunteer.map((v: any, i: number) => (
          <div key={i} style={{ marginBottom: 12, paddingLeft: 16, borderLeft: '2px solid #e5e7eb' }}>
            <span style={{ fontWeight: 600 }}>{v.role} <span style={{ color: '#777', fontWeight: 400 }}>@ {v.organisation}</span></span>
            <ul style={{ paddingLeft: 14, marginTop: 4 }}>{(v.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ fontSize: '9.5pt', color: '#555', lineHeight: 1.6 }}>{b}</li>)}</ul>
          </div>
        ))}</>
      }

      {certs.length > 0 && <><H label="Certifications" />
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {certs.map((c: any, i: number) => <span key={i} style={{ background: '#f3f4f6', borderRadius: 6, padding: '3px 10px', fontSize: '9pt', color: '#444' }}>{c.name}{c.date ? ` · ${c.date}` : ''}</span>)}
        </div></>
      }

      {publications.length > 0 && <><H label="Publications" />
        {publications.map((pub: any, i: number) => (
          <div key={i} style={{ marginBottom: 6, fontSize: '9.5pt' }}>
            <span style={{ fontWeight: 600 }}>{typeof pub === 'string' ? pub : pub.title}</span>
            {pub.journal && <span style={{ color: '#888' }}> — {pub.journal}</span>}
          </div>
        ))}</>
      }

      {achievements.length > 0 && <><H label="Achievements & Awards" />
        <ul style={{ paddingLeft: 14 }}>{achievements.map((a: any, i: number) => <li key={i} style={{ fontSize: '9.5pt', color: '#555', lineHeight: 1.6, marginBottom: 2 }}>{typeof a === 'string' ? a : a.title}</li>)}</ul></>
      }

      {langs.length > 0 && <><H label="Languages" />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
          {langs.map((l: any, i: number) => <span key={i} style={{ fontSize: '9.5pt' }}>{l.language} <span style={{ color: '#aaa' }}>({l.proficiency})</span></span>)}
        </div></>
      }

      {interests.length > 0 && <><H label="Interests" />
        <div style={{ fontSize: '9.5pt', color: '#666' }}>{interests.join(' · ')}</div></>
      }
    </div>
  );
}

function Professional({ r }: { r: any }) {
  const p = r.personal_info ?? {};
  const exp: any[] = r.experience ?? [];
  const edu: any[] = r.education ?? [];
  const skills: any[] = r.skills ?? [];
  const certs: any[] = r.certifications ?? [];
  const langs: any[] = r.languages ?? [];
  const projects: any[] = r.projects ?? [];
  const achievements: any[] = [...(r.achievements ?? []), ...(r.awards ?? [])];
  const volunteer: any[] = r.volunteer ?? [];
  const publications: any[] = r.publications ?? [];
  const interests: any[] = r.interests ?? [];

  const accent = '#065f46';
  const H = ({ label }: { label: string }) => (
    <div style={{ fontSize: '9.5pt', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 16 }}>{label}</div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', color: '#111', maxWidth: 780, margin: '0 auto' }}>
      <div style={{ background: accent, color: 'white', padding: '28px 40px 24px' }}>
        {p.name && <h1 style={{ fontSize: '24pt', fontWeight: 700, marginBottom: 6, color: 'white' }}>{p.name}</h1>}
        <div style={{ fontSize: '9pt', color: '#a7f3d0', display: 'flex', flexWrap: 'wrap' as const, gap: 14 }}>
          {[p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean).map((v, i) => <span key={i}>{i > 0 ? '• ' : ''}{v}</span>)}
        </div>
      </div>
      <div style={{ padding: '24px 40px' }}>
        {r.summary && <><H label="Profile" /><p style={{ color: '#444', lineHeight: 1.65, marginBottom: 4 }}>{r.summary}</p></>}

        {exp.length > 0 && <><H label="Experience" />
          {exp.map((e: any, i: number) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' as const, background: '#f0fdf4', padding: '5px 8px', borderRadius: 4, marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{e.title}<span style={{ color: accent }}>{e.company ? ` @ ${e.company}` : ''}</span>{e.location ? <span style={{ color: '#6b7280', fontWeight: 400 }}>, {e.location}</span> : ''}</span>
                <span style={{ fontSize: '9pt', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
              </div>
              <ul style={{ paddingLeft: 16 }}>
                {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.55, marginBottom: 2, color: '#333' }}>{b}</li>)}
              </ul>
            </div>
          ))}</>
        }

        {projects.length > 0 && <><H label="Projects" />
          {projects.map((proj: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' as const, background: '#f0fdf4', padding: '5px 8px', borderRadius: 4, marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{proj.name}{proj.tech?.length > 0 && <span style={{ color: accent, fontWeight: 400 }}> [{proj.tech.join(', ')}]</span>}</span>
                {(proj.startDate || proj.endDate) && <span style={{ fontSize: '9pt', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}</span>}
              </div>
              {proj.description && <div style={{ fontSize: '9.5pt', color: '#555', marginBottom: 3 }}>{proj.description}</div>}
              <ul style={{ paddingLeft: 16 }}>{(proj.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.55, marginBottom: 2, color: '#333' }}>{b}</li>)}</ul>
              {proj.url && <div style={{ fontSize: '9pt', color: '#888', marginTop: 2 }}>{proj.url}</div>}
            </div>
          ))}</>
        }

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 4 }}>
          {skills.length > 0 && <div><H label="Skills" />
            {skills.map((sg: any, i: number) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700, fontSize: '9.5pt' }}>{sg.category}: </span><span style={{ color: '#444', fontSize: '9.5pt' }}>{(sg.items ?? []).join(', ')}</span></div>)}
          </div>}
          {edu.length > 0 && <div><H label="Education" />
            {edu.map((e: any, i: number) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 700 }}>{e.degree}</div><div style={{ color: '#555' }}>{e.school}</div><div style={{ fontSize: '9pt', color: '#888' }}>{e.endDate}{e.grade ? ` · ${e.grade}` : ''}</div></div>)}
          </div>}
        </div>

        {volunteer.length > 0 && <><H label="Volunteer Experience" />
          {volunteer.map((v: any, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' as const, background: '#f0fdf4', padding: '4px 8px', borderRadius: 4, marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{v.role}{v.organisation && <span style={{ color: accent }}> @ {v.organisation}</span>}</span>
                <span style={{ fontSize: '9pt', color: '#6b7280', whiteSpace: 'nowrap' as const }}>{v.startDate}{v.endDate ? ` – ${v.endDate}` : ''}</span>
              </div>
              <ul style={{ paddingLeft: 16 }}>{(v.bullets ?? []).map((b: string, j: number) => <li key={j} style={{ lineHeight: 1.55, color: '#333' }}>{b}</li>)}</ul>
            </div>
          ))}</>
        }

        {certs.length > 0 && <><H label="Certifications" />
          {certs.map((c: any, i: number) => <div key={i} style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>{c.name}</span><span style={{ color: '#666', fontSize: '9pt' }}>{c.issuer ? ` · ${c.issuer}` : ''}{c.date ? ` · ${c.date}` : ''}</span></div>)}</>
        }

        {publications.length > 0 && <><H label="Publications" />
          {publications.map((pub: any, i: number) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700 }}>{typeof pub === 'string' ? pub : pub.title}</span>
              {pub.journal && <span style={{ color: '#555', fontSize: '9.5pt' }}> — {pub.journal}</span>}
              {pub.date && <span style={{ color: '#888', fontSize: '9.5pt' }}> ({pub.date})</span>}
            </div>
          ))}</>
        }

        {achievements.length > 0 && <><H label="Achievements & Awards" />
          {achievements.map((a: any, i: number) => <div key={i} style={{ marginBottom: 4 }}>• {typeof a === 'string' ? a : a.title}</div>)}</>
        }

        {langs.length > 0 && <><H label="Languages" />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>{langs.map((l: any, i: number) => <span key={i}>{l.language} <span style={{ color: '#888' }}>({l.proficiency})</span></span>)}</div></>
        }

        {interests.length > 0 && <><H label="Interests" />
          <div style={{ color: '#444' }}>{interests.join(' · ')}</div></>
        }
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
    harvard: <Harvard r={resume} />,
    modern: <Modern r={resume} />,
    classic: <Classic r={resume} />,
    minimal: <Minimal r={resume} />,
    professional: <Professional r={resume} />,
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
        .btn-print { background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
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
