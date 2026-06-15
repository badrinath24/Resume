export function getResumeParserPrompt(resumeText: string): string {
  return (
    'You are an expert resume parser. Extract all information from the resume text and return ONLY a valid JSON object with this exact structure: { personal: { name, email, phone, location, linkedin, portfolio }, summary, experience: [{ company, title, startDate, endDate, location, bullets[] }], education: [{ school, degree, startDate, endDate, grade }], skills: [{ category, items[] }], certifications: [{ name, issuer, date, url }], languages: [{ language, proficiency }] }. Rules: Return ONLY raw JSON. No markdown. No backticks. No explanation. Empty string for missing fields. Resume text: ' +
    resumeText
  );
}

export function getJobParserPrompt(jobText: string): string {
  return (
    'You are an expert job description parser. Extract all information from the job posting and return ONLY a valid JSON object with this exact structure: { jobTitle, company, location, contractType, experienceRequired, educationRequired, hardSkills: [], softSkills: [], responsibilities: [], qualifications: [], keywords: [], keyHighlights: [] }. The keywords array must contain 15-25 relevant keywords from the job description. Rules: Return ONLY raw JSON. No markdown. No backticks. No explanation. Empty string for missing string fields, empty array for missing array fields. Job posting text: ' +
    jobText
  );
}

export function getTailoringPrompt(resumeJson: string, jobJson: string, level: string): string {
  return (
    `You are an expert resume tailor and ATS optimization specialist. Tailor the provided resume to match the job description at the specified level. Tailoring level: ${level}. LOW = keyword additions only, minimal changes. MEDIUM = rewrite summary and top bullets for better alignment. HIGH = aggressive rewriting of all sections for maximum match. Rules: Never invent experience, companies, degrees, or dates that are not in the original resume. Only enhance and reframe existing content. Return ONLY valid JSON with this exact structure: { atsScore: number 0-100, tailoredResume: { same structure as input resume }, changes: [{ section, original, improved, reason, scoreImpact }], matchedKeywords: [], missingKeywords: [] }. No markdown. No backticks. No explanation outside the JSON. Resume JSON: ` +
    resumeJson +
    ' Job JSON: ' +
    jobJson
  );
}

export function getATSScorePrompt(resumeJson: string, jobJson: string): string {
  return (
    'You are an expert ATS (Applicant Tracking System) analyst. Analyze the resume against the job description across exactly 10 categories. Return ONLY valid JSON with this exact structure: { totalScore: number, breakdown: { jobTitleMatch: { score, maxScore: 10, status, details, suggestions: [] }, yearsOfExperience: { score, maxScore: 10, status, details, suggestions: [] }, educationMatch: { score, maxScore: 10, status, details, suggestions: [] }, hardSkills: { score, maxScore: 20, status, details, suggestions: [] }, softSkills: { score, maxScore: 10, status, details, suggestions: [] }, contactInformation: { score, maxScore: 10, status, details, suggestions: [] }, locationMatch: { score, maxScore: 10, status, details, suggestions: [] }, formatting: { score, maxScore: 10, status, details, suggestions: [] }, wordCount: { score, maxScore: 5, status, details, suggestions: [] }, measurableResults: { score, maxScore: 5, status, details, suggestions: [] } } }. Status must be one of: good, warning, or poor. totalScore is sum of all category scores. No markdown. No backticks. Resume JSON: ' +
    resumeJson +
    ' Job JSON: ' +
    jobJson
  );
}

export function getCoverLetterPrompt(resumeJson: string, jobJson: string): string {
  return (
    'You are an expert cover letter writer. Write a professional cover letter based on the resume and job description provided. Requirements: Exactly 3 paragraphs. Total length 280-380 words. Opening paragraph connects the candidate to the company and role specifically. Body paragraph connects 2-3 key achievements from the resume to the job requirements. Closing paragraph includes a clear call to action. Tone: professional, confident, and personable. Do NOT use generic filler phrases. Do NOT include date, address headers, or signature block. Return plain text only. No JSON. No markdown. No backticks. Resume JSON: ' +
    resumeJson +
    ' Job JSON: ' +
    jobJson
  );
}
