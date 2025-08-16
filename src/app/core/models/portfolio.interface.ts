export interface PersonalInfo {
  name: string;
  title: string;
  description: string;
  location: string;
  linkedIn: string;
}

export interface CoreValue {
  title: string;
  description: string;
  icon?: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  current?: boolean;
}

export interface Education {
  period?: string;
  degree: string;
  institution: string;
  honors?: string;
  coursework?: string[];
}

export interface SkillCategory {
  label: string;
  skills: string[];
  icon?: string;
}

export interface CertificationCategory {
  category: string;
  certifications: string[];
}


export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface NavigationItem {
  label: string;
  route: string;
  icon?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  coreValues: CoreValue[];
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  certifications: CertificationCategory[];
  socialLinks: SocialLink[];
  navigation: NavigationItem[];
}