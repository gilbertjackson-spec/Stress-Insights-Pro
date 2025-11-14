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
  current_role_time: string;
  age_range: string;
  health_issue: 'Sim' | 'Não' | 'Prefiro não dizer';
}

export interface Answer {
  answer_id: number;
  respondent_id: number;
  question_id: number;
  raw_response: string; // e.g., "Sempre"
  calculated_score: number; // 1-5
  sentiment: Sentiment;
}

export interface Respondent {
  respondent_id: number;
  deployment_id: number;
  status: 'pending' | 'started' | 'completed';
  demographics: Demographics;
  answers: Answer[];
}

export type SurveyStatus = 'draft' | 'active' | 'suspended' | 'closed';

export interface SurveyDeployment {
  deployment_id: number;
  template_id: number;
  company_id: number;
  start_date: string;
  end_date: string;
  status: SurveyStatus;
  total_invited: number;
  respondents: Respondent[];
}

export interface Company {
  company_id: number;
  name: string;
  deployments: SurveyDeployment[];
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
  domain_analysis: DomainAnalysis[];
  demographic_options: {
    units: string[];
    sectors: string[];
    age_ranges: string[];
    current_role_times: string[];
  }
}
