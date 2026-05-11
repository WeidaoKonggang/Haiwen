export type Language = 'en' | 'zh';

export type LocalizedText = {
  en: string;
  zh: string;
};

export type Region = 'EU' | 'China' | 'Singapore' | 'Southeast Asia' | 'United States';

export type Category =
  | 'ESG Disclosure'
  | 'AI Governance'
  | 'Market Entry'
  | 'Data Compliance'
  | 'Sustainability Reporting';

export type BriefingItem = {
  id: string;
  source: 'mock' | 'api';
  url: string;
  title: LocalizedText;
  region: Region;
  category: Category;
  summary: LocalizedText;
  whyThisMatters: LocalizedText;
  transcript: LocalizedText;
};

export type ConsultationResult = {
  id: string;
  language: Language;
  title: string;
  question: string;
  bullets: string[];
  whyThisMatters: string;
  createdAt: string;
};

export type SavedItem = {
  id: string;
  sourceId: string;
  title: string;
  type: 'Briefing' | 'Consultation';
  date: string;
  url: string;
};
