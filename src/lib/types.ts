export type Sentiment = 'Favorável' | 'Neutro' | 'Desfavorável';

export interface Question {
  question_id: number;
  domain_id: number;
  question_text: string;
  question_code: string;
  is_inverted_score: boolean;
}

export interface Domain {
  domain_id: number;
  template_id: number;
  name: string;
  benchmark_private_sector: number;
  percentile_25: number;
  percentile_75: number;
  text_result_low: string;
  text_result_medium: string;
  text_result_high: string;
  description: string;
  questions: Question[];
}

export interface SurveyTemplate {
  template_id: number;
  name: string;
  domains: Domain[];
}

export interface Demographics {
  unit: string;
  sector: string;
  position: string;
  current_role_time: string;
  age_range: string;
  health_issue?: 'Sim' | 'Não' | 'Prefiro não dizer';
}

export interface Answer {
  id: string; // Firestore document id
  questionId: number;
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
  demographics: Demographics;
  completedAt: string;
  answers?: Answer[]; // This will be populated after fetching
}

export type SurveyStatus = 'draft' | 'active' | 'suspended' | 'closed' | 'archived';

export interface SurveyDeployment {
  id: string; // Firestore document ID
  templateId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  status: SurveyStatus;
  totalInvited: number;
  totalEmployees: number;
  respondents?: Respondent[];
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
  question_id: number;
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
  domain_id: number;
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
