'use server'

import { getMockSurveyTemplate } from './mock-data';
import type { Answer, DashboardData, Demographics, Domain, DomainAnalysis, QuestionAnalysis, Respondent, SurveyDeployment } from './types';
import { initializeFirebase } from '@/firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';

export interface Filters {
  unit?: string | 'all';
  sector?: string | 'all';
  position?: string | 'all';
  age_range?: string | 'all';
  current_role_time?: string | 'all';
}

// Helper to fetch all respondents and their answers for a given deployment
async function getRespondentsWithAnswers(deploymentId: string): Promise<Respondent[]> {
    const { firestore } = initializeFirebase();
    const respondentsRef = collection(firestore, 'survey_deployments', deploymentId, 'respondents');
    const respondentsSnap = await getDocs(respondentsRef);

    const respondents: Respondent[] = [];

    for (const respondentDoc of respondentsSnap.docs) {
        const respondentData = respondentDoc.data() as Omit<Respondent, 'id' | 'answers'>;
        
        const answersRef = collection(respondentDoc.ref, 'answers');
        const answersSnap = await getDocs(answersRef);
        const answers = answersSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Answer));

        respondents.push({
            ...respondentData,
            id: respondentDoc.id,
            answers,
        });
    }

    return respondents;
}


function filterRespondents(respondents: Respondent[], filters: Filters): Respondent[] {
  return respondents.filter(respondent => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      return respondent.demographics[key as keyof Demographics] === value;
    });
  });
}

function analyzeQuestion(questionId: number, respondents: Respondent[]): { average_score: number; sentiment_distribution: any } {
  const relevantAnswers = respondents.flatMap(r => 
      (r.answers || []).filter(a => a.questionId === questionId)
  );

  if (relevantAnswers.length === 0) {
    return {
      average_score: 0,
      sentiment_distribution: {
        favorable_perc: 0, neutral_perc: 0, unfavorable_perc: 0,
        favorable_count: 0, neutral_count: 0, unfavorable_count: 0,
      },
    };
  }

  const totalScore = relevantAnswers.reduce((sum, answer) => sum + answer.calculatedScore, 0);
  const average_score = totalScore / relevantAnswers.length;

  const sentimentCounts = relevantAnswers.reduce((counts, answer) => {
    if (answer.sentiment === 'Favorável') counts.favorable_count++;
    else if (answer.sentiment === 'Neutro') counts.neutral_count++;
    else if (answer.sentiment === 'Desfavorável') counts.unfavorable_count++;
    return counts;
  }, { favorable_count: 0, neutral_count: 0, unfavorable_count: 0 });

  const totalAnswers = relevantAnswers.length;
  const sentiment_distribution = {
    ...sentimentCounts,
    favorable_perc: (sentimentCounts.favorable_count / totalAnswers) * 100,
    neutral_perc: (sentimentCounts.neutral_count / totalAnswers) * 100,
    unfavorable_perc: (sentimentCounts.unfavorable_count / totalAnswers) * 100,
  };

  return { average_score, sentiment_distribution };
}

function analyzeDomain(domain: Domain, respondents: Respondent[]): DomainAnalysis {
  const questions_analysis: QuestionAnalysis[] = domain.questions.map(q => {
    const { average_score, sentiment_distribution } = analyzeQuestion(q.question_id, respondents);
    return {
      question_id: q.question_id,
      question_code: q.question_code,
      question_text: q.question_text,
      average_score,
      sentiment_distribution,
    };
  });

  const validQuestionAnalyses = questions_analysis.filter(qa => qa.average_score > 0);
  
  const domain_score = validQuestionAnalyses.length > 0
    ? validQuestionAnalyses.reduce((sum, qa) => sum + qa.average_score, 0) / validQuestionAnalyses.length
    : 0;
  
  let strong_point: QuestionAnalysis | null = null;
  let weak_point: QuestionAnalysis | null = null;

  if (validQuestionAnalyses.length > 0) {
    strong_point = [...validQuestionAnalyses].sort((a, b) => b.average_score - a.average_score)[0];
    weak_point = [...validQuestionAnalyses].sort((a, b) => a.average_score - b.average_score)[0];
  }

  return {
    domain_id: domain.domain_id,
    domain_name: domain.name,
    domain_score,
    benchmark_private_sector: domain.benchmark_private_sector,
    percentile_25: domain.percentile_25,
    percentile_75: domain.percentile_75,
    text_result_low: domain.text_result_low,
    text_result_medium: domain.text_result_medium,
    text_result_high: domain.text_result_high,
    description: domain.description,
    strong_point,
    weak_point,
    questions_analysis,
  };
}

export async function getDashboardData(deploymentId: string, filters: Filters): Promise<DashboardData> {
  const { firestore } = initializeFirebase();

  // 1. Fetch deployment details
  const deploymentRef = doc(firestore, 'survey_deployments', deploymentId);
  const deploymentSnap = await getDoc(deploymentRef);
  if (!deploymentSnap.exists()) {
      throw new Error("Survey deployment not found.");
  }
  const deployment = deploymentSnap.data() as SurveyDeployment;

  // 2. Fetch all respondents and their answers for this deployment
  const allRespondents = await getRespondentsWithAnswers(deploymentId);
  
  // 3. Get the survey template (still from mock, can be moved to Firestore later)
  const template = getMockSurveyTemplate();

  // 4. Filter respondents based on the dashboard filters
  const filteredRespondents = filterRespondents(allRespondents, filters);

  // 5. Analyze domains based on filtered respondents
  const domain_analysis = template.domains.map(domain => analyzeDomain(domain, filteredRespondents));

  // 6. Calculate summary stats
  const total_respondents = filteredRespondents.length;
  const completion_rate = deployment.totalInvited > 0 ? (allRespondents.length / deployment.totalInvited) * 100 : 0;
  
  // 7. Get available demographic options from all respondents (before filtering)
  const demographic_options = {
    units: ['all', ...new Set(allRespondents.map(r => r.demographics.unit))],
    sectors: ['all', ...new Set(allRespondents.map(r => r.demographics.sector))],
    positions: ['all', ...new Set(allRespondents.map(r => r.demographics.position))],
    age_ranges: ['all', ...new Set(allRespondents.map(r => r.demographics.age_range))],
    current_role_times: ['all', ...new Set(allRespondents.map(r => r.demographics.current_role_time))],
  };

  return {
    total_respondents,
    completion_rate,
    domain_analysis,
    demographic_options
  };
}
