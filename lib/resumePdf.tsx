import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Link,
} from '@react-pdf/renderer';

const colors = {
  primary: '#1a56db',
  dark: '#111827',
  gray: '#4b5563',
  light: '#9ca3af',
  border: '#e5e7eb',
  bg: '#f9fafb',
};

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9.5, color: colors.dark, paddingTop: 36, paddingBottom: 36, paddingHorizontal: 44 },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: colors.dark, marginBottom: 4 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  contactItem: { fontSize: 8.5, color: colors.gray },
  divider: { borderBottomWidth: 1.5, borderBottomColor: colors.primary, marginBottom: 8 },
  sectionTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  section: { marginBottom: 14 },
  summary: { fontSize: 9.5, color: colors.gray, lineHeight: 1.5 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  jobTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.dark },
  company: { fontSize: 9.5, color: colors.gray },
  dates: { fontSize: 8.5, color: colors.light },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 12, fontSize: 9.5, color: colors.gray },
  bulletText: { flex: 1, fontSize: 9.5, color: colors.gray, lineHeight: 1.45 },
  expBlock: { marginBottom: 10 },
  skillRow: { flexDirection: 'row', marginBottom: 4 },
  skillCat: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: colors.dark, width: 100 },
  skillItems: { flex: 1, fontSize: 9.5, color: colors.gray },
  eduBlock: { marginBottom: 8 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between' },
  degree: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.dark },
  school: { fontSize: 9.5, color: colors.gray },
  certBlock: { marginBottom: 6 },
  certName: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: colors.dark },
  certMeta: { fontSize: 8.5, color: colors.gray },
  twoCol: { flexDirection: 'row', gap: 24 },
  col: { flex: 1 },
});

export function ResumePDF({ resume }: { resume: any }) {
  const p = resume.personal_info ?? {};
  const exp: any[] = resume.experience ?? [];
  const edu: any[] = resume.education ?? [];
  const skills: any[] = resume.skills ?? [];
  const certs: any[] = resume.certifications ?? [];
  const langs: any[] = resume.languages ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {p.name ? <Text style={styles.name}>{p.name}</Text> : null}
        <View style={styles.contactRow}>
          {p.email ? <Text style={styles.contactItem}>{p.email}</Text> : null}
          {p.phone ? <Text style={styles.contactItem}>• {p.phone}</Text> : null}
          {p.location ? <Text style={styles.contactItem}>• {p.location}</Text> : null}
          {p.linkedin ? <Text style={styles.contactItem}>• {p.linkedin}</Text> : null}
          {p.portfolio ? <Text style={styles.contactItem}>• {p.portfolio}</Text> : null}
        </View>

        {/* Summary */}
        {resume.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.divider} />
            <Text style={styles.summary}>{resume.summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {exp.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.divider} />
            {exp.map((e: any, i: number) => (
              <View key={i} style={styles.expBlock}>
                <View style={styles.expHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{e.title}</Text>
                    <Text style={styles.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</Text>
                  </View>
                  <Text style={styles.dates}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</Text>
                </View>
                {(e.bullets ?? []).filter((b: string) => b?.trim()).map((b: string, j: number) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills + Education side by side */}
        <View style={styles.twoCol}>
          {/* Skills */}
          {skills.length > 0 ? (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.divider} />
              {skills.map((sg: any, i: number) => (
                <View key={i} style={styles.skillRow}>
                  <Text style={styles.skillCat}>{sg.category}:</Text>
                  <Text style={styles.skillItems}>{(sg.items ?? []).join(', ')}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Education */}
          {edu.length > 0 ? (
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Education</Text>
              <View style={styles.divider} />
              {edu.map((e: any, i: number) => (
                <View key={i} style={styles.eduBlock}>
                  <View style={styles.eduRow}>
                    <Text style={styles.degree}>{e.degree}</Text>
                    <Text style={styles.dates}>{e.endDate}</Text>
                  </View>
                  <Text style={styles.school}>{e.school}</Text>
                  {e.grade ? <Text style={styles.certMeta}>Grade: {e.grade}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Certifications */}
        {certs.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.divider} />
            {certs.map((c: any, i: number) => (
              <View key={i} style={styles.certBlock}>
                <Text style={styles.certName}>{c.name}</Text>
                <Text style={styles.certMeta}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Languages */}
        {langs.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.divider} />
            <View style={styles.contactRow}>
              {langs.map((l: any, i: number) => (
                <Text key={i} style={styles.contactItem}>{l.language} ({l.proficiency}){i < langs.length - 1 ? ' •' : ''}</Text>
              ))}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
