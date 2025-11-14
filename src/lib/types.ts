export type Sentiment = 'Favorável' | 'Neutro' | 'Desfavorável';

export interface Question {
  id: string; 
  domainId: string;
  questionText: string;
  questionCode: string;
  isInvertedScore: boolean;
}

export interface Domain {
  id: string;
  templateId: string;
  name: string;
  benchmarkPrivateSector: number;
  percentile25: number;
  percentile75: number;
  textResultLow: string;
  textResultMedium: string;
  textResultHigh: string;
  descriptionText: string; // Renamed from description
  questions: Question[];
}

export interface SurveyTemplate {
  id: string;
  name: string;
  domains: Domain[];
}

export interface Demographics {
  unit?: string;
  sector?: string;
  position?: string;
  current_role_time?: string;
  age_range?: string;
  health_issue?: 'Sim' | 'Não' | 'Prefiro não dizer';
}

export interface Answer {
  id: string; // Firestore document id
  questionId: string;
  rawResponse: string;
  calculatedScore: number;
  sentiment: Sentiment;
  domainName: string;
  questionCode: string;
}

export interface Respondent {
  id: string; // Firestore document id
  deploymentId: string;
  status: 'pending' | 'started' | 'completed';
  demographics: Partial<Demographics>; // It can be partial during creation
  completedAt?: string;
  answers?: Answer[];
}

export type SurveyStatus = 'draft' | 'active' | 'suspended' | 'closed' | 'archived';

export interface SurveyDeployment {
  id: string; // Firestore document ID
  name: string; // Custom name for the deployment
  templateId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  status: SurveyStatus;
  totalInvited: number;
  totalEmployees: number;
}

export interface Company {
    id: string; // Firestore document ID
    name: string;
}

export interface Unit {
    id: string; // Firestore document ID
    name: string;
    companyId: string;
}

export interface Sector {
    id: string; // Firestore document ID
    name: string;
    unitId: string;
}

export interface Position {
    id: string;
    name: string;
    companyId: string;
}


// Analysis Types

export interface QuestionAnalysis {
  question_id: string;
  question_code: string;
  question_text: string;
  average_score: number;
  sentiment_distribution: {
    favorable_perc: number;
    neutral_perc: number;
    unfavorable_perc: number;
    favorable_count: number;
    neutral_count: number;
    unfavorable_count: number;
  };
}

export interface DomainAnalysis {
  domain_id: string;
  domain_name: string;
  domain_score: number;
  benchmark_private_sector: number;
  percentile_25: number;
  percentile_75: number;
  text_result_low: string;
  text_result_medium: string;
  text_result_high: string;
  description: string;
  strong_point: QuestionAnalysis | null;
  weak_point: QuestionAnalysis | null;
  questions_analysis: QuestionAnalysis[];
}

export interface DashboardData {
  total_respondents: number;
  completion_rate: number;
  surveyStatus: SurveyStatus;
  domain_analysis: DomainAnalysis[];
  demographic_options: {
    units: string[];
    sectors: string[];
    positions: string[];
    age_ranges: string[];
    current_role_times: string[];
  }
}

