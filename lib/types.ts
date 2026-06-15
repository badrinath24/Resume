export interface ResumePersonal {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface ResumeExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  rawText: string;
  personalInfo: ResumePersonal;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  fileUrl: string;
  isMaster: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
  jobDescription: string;
  tailoredResumeId: string;
  tailoredPdfUrl: string;
  atsScore: number;
  scoreBreakdown: any;
  status: string;
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  applicationId: string;
  content: string;
  createdAt: string;
}

export interface TailoringChange {
  section: string;
  original: string;
  improved: string;
  reason: string;
  scoreImpact: number;
}

export interface ATSCategory {
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'poor';
  details: string;
  suggestions: string[];
}

export interface ATSBreakdown {
  totalScore: number;
  jobTitle: string;
  company: string;
  breakdown: {
    jobTitleMatch: ATSCategory;
    yearsOfExperience: ATSCategory;
    educationMatch: ATSCategory;
    hardSkills: ATSCategory;
    softSkills: ATSCategory;
    contactInformation: ATSCategory;
    locationMatch: ATSCategory;
    formatting: ATSCategory;
    wordCount: ATSCategory;
    measurableResults: ATSCategory;
  };
}

export interface JobData {
  jobTitle: string;
  company: string;
  location: string;
  contractType: string;
  description: string;
  requiredSkills: string[];
  keywords: string[];
}
