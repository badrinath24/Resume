'use client';

import { useSearchParams } from 'next/navigation';

export default function CoverLetterPrint() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template') ?? 'modern';
  const content = searchParams.get('content') ? decodeURIComponent(searchParams.get('content')!) : '';

  // Parse the letter — first 4 lines = header, rest = body
  const lines = content.split('\n');
  const headerLines = lines.slice(0, 4);
  const bodyText = lines.slice(4).join('\n').trim();

  const styles: Record<string, React.CSSProperties> = {
    harvard: {
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '11pt',
      lineHeight: '1.8',
      color: '#111',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '60px 72px',
    },
    modern: {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '11pt',
      lineHeight: '1.7',
      color: '#1a1a1a',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '0',
    },
    classic: {
      fontFamily: 'Georgia, serif',
      fontSize: '11pt',
      lineHeight: '1.8',
      color: '#111',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '60px 72px',
    },
    minimal: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '10.5pt',
      lineHeight: '1.9',
      color: '#333',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '80px 80px',
    },
    professional: {
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '11pt',
      lineHeight: '1.7',
      color: '#111',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '0',
    },
  };

  const bodyStyle = styles[template] ?? styles.modern;

  function renderHeader() {
    if (template === 'harvard') {
      return (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {headerLines.map((l, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? 'bold' : 'normal', fontSize: i === 0 ? '13pt' : '11pt', marginBottom: '2px' }}>{l}</div>
          ))}
          <div style={{ borderBottom: '1px solid #111', marginTop: '12px' }} />
        </div>
      );
    }

    if (template === 'modern') {
      return (
        <div style={{ background: '#ef4444', color: 'white', padding: '32px 48px 28px', marginBottom: '0' }}>
          {headerLines.map((l, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? 'bold' : 'normal', fontSize: i === 0 ? '15pt' : '10pt', opacity: i === 0 ? 1 : 0.85, marginBottom: '2px' }}>{l}</div>
          ))}
        </div>
      );
    }

    if (template === 'classic') {
      return (
        <div style={{ textAlign: 'center', marginBottom: '36px', borderBottom: '2px solid #1e3a5f', paddingBottom: '16px' }}>
          {headerLines.map((l, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? 'bold' : 'normal', fontSize: i === 0 ? '14pt' : '11pt', color: i === 0 ? '#1e3a5f' : '#444', marginBottom: '3px' }}>{l}</div>
          ))}
        </div>
      );
    }

    if (template === 'minimal') {
      return (
        <div style={{ marginBottom: '40px' }}>
          {headerLines.map((l, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? '600' : 'normal', fontSize: i === 0 ? '14pt' : '10pt', color: i === 0 ? '#111' : '#888', marginBottom: '2px', letterSpacing: i === 0 ? '0.02em' : '0' }}>{l}</div>
          ))}
          <div style={{ width: '40px', height: '3px', background: '#6b7280', marginTop: '12px' }} />
        </div>
      );
    }

    if (template === 'professional') {
      return (
        <div style={{ background: '#065f46', color: 'white', padding: '36px 48px 30px', marginBottom: '0' }}>
          {headerLines.map((l, i) => (
            <div key={i} style={{ fontWeight: i === 0 ? 'bold' : 'normal', fontSize: i === 0 ? '15pt' : '10pt', opacity: i === 0 ? 1 : 0.8, marginBottom: '2px' }}>{l}</div>
          ))}
        </div>
      );
    }

    return null;
  }

  const needsInnerPadding = template === 'modern' || template === 'professional';

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          @page { margin: 0; size: A4; }
        }
        body { background: #f3f4f6; margin: 0; }
      `}</style>

      {/* Print button */}
      <div className="no-print" style={{ background: '#1f2937', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'white', fontSize: '13px', fontFamily: 'Arial', fontWeight: 600 }}>✉️ Cover Letter PDF Preview</span>
        <button
          onClick={() => window.print()}
          style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
        >
          ⬇️ Save as PDF
        </button>
      </div>

      {/* Page */}
      <div style={{ background: '#f3f4f6', minHeight: '100vh', paddingTop: '24px', paddingBottom: '40px' }}>
        <div style={{ background: 'white', maxWidth: '680px', margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minHeight: '980px', overflow: 'hidden', fontFamily: bodyStyle.fontFamily }}>
          {renderHeader()}
          <div style={needsInnerPadding ? { ...bodyStyle, paddingTop: '36px', paddingLeft: '48px', paddingRight: '48px', paddingBottom: '60px' } : bodyStyle}>
            {!needsInnerPadding && renderHeader() === null && null}
            <div style={{ whiteSpace: 'pre-wrap', fontSize: bodyStyle.fontSize, lineHeight: bodyStyle.lineHeight, color: bodyStyle.color }}>
              {bodyText}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
