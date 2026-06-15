import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Resume } from '@/lib/types';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, paddingTop: 72, paddingBottom: 72, paddingLeft: 72, paddingRight: 72, color: '#1a1a1a' },
  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 },
  contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12, fontSize: 9, color: '#444' },
  sep: { marginHorizontal: 4, color: '#999' },
  hr: { borderBottomWidth: 1, borderBottomColor: '#cccccc', marginBottom: 10 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, borderBottomWidth: 0.5, borderBottomColor: '#aaaaaa', paddingBottom: 2, marginBottom: 6, marginTop: 10 },
  jobRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  jobCompany: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  jobDates: { fontSize: 9, color: '#555' },
  bullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 10 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillCategory: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, width: 100 },
  skillItems: { flex: 1, fontSize: 9.5 },
  certRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
});

export default function ResumePDF({ resume }: { resume: Resume }) {
  const p = resume.personalInfo ?? {};
  const contactParts = [p.email, p.phone, p.location, p.linkedin, p.portfolio].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {p.name ? <Text style={styles.name}>{p.name}</Text> : null}
        {contactParts.length > 0 && (
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                {i > 0 && <Text style={styles.sep}>|</Text>}
                <Text>{part}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.hr} />

        {resume.summary ? (
          <View>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.5, color: '#333' }}>{resume.summary}</Text>
          </View>
        ) : null}

        {(resume.experience ?? []).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.jobRow}>
                  <Text style={styles.jobCompany}>{exp.company}</Text>
                  <Text style={styles.jobDates}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                </View>
                <Text style={{ fontSize: 10, fontStyle: 'italic' }}>{exp.title}{exp.location ? ` · ${exp.location}` : ''}</Text>
                {(exp.bullets ?? []).filter(Boolean).map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {(resume.education ?? []).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={styles.eduRow}>
                <View>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>{edu.school}</Text>
                  <Text style={{ fontSize: 9.5 }}>{edu.degree}{edu.grade ? ` · ${edu.grade}` : ''}</Text>
                </View>
                <Text style={styles.jobDates}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {(resume.skills ?? []).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            {resume.skills.map((sg, i) => (
              <View key={i} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{sg.category}:</Text>
                <Text style={styles.skillItems}>{(sg.items ?? []).join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {(resume.certifications ?? []).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((cert, i) => (
              <View key={i} style={styles.certRow}>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9.5 }}>{cert.name}</Text>
                <Text style={{ fontSize: 9, color: '#555' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {(resume.languages ?? []).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={{ fontSize: 9.5 }}>{resume.languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
