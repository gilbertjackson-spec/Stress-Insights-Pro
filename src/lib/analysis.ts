'use client';

import type { Answer, DashboardData, Demographics, Domain, DomainAnalysis, Question, QuestionAnalysis, Respondent, SurveyDeployment, SurveyStatus, SurveyTemplate } from './types';
import { getDocs, collection, doc, getDoc, Firestore } from 'firebase/firestore';

export interface Filters {
  unit?: string | 'all';
  sector?: string | 'all';
  position?: string | 'all';
  age_range?: string | 'all';
  gender?: string | 'all';
  current_role_time?: string | 'all';
}

// Helper to fetch all respondents and their answers for a given deployment
async function getRespondentsWithAnswers(firestore: Firestore, deploymentId: string): Promise<Respondent[]> {
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

// Helper to fetch the full survey template (template -> domains -> questions)
async function getFullSurveyTemplate(firestore: Firestore, templateId: string): Promise<SurveyTemplate> {
  const templateRef = doc(firestore, 'survey_templates', templateId);
  const templateSnap = await getDoc(templateRef);
  if (!templateSnap.exists()) {
    throw new Error(`Survey template with id ${templateId} not found.`);
  }
  const templateData = { ...templateSnap.data(), id: templateSnap.id } as SurveyTemplate;

  const domainsRef = collection(templateRef, 'domains');
  const domainsSnap = await getDocs(domainsRef);
  
  const domains: Domain[] = [];
  for (const domainDoc of domainsSnap.docs) {
    const data = domainDoc.data();
    const domainData: Domain = {
      id: domainDoc.id,
      templateId: templateId,
      name: data.name,
      benchmarkPrivateSector: data.benchmarkPrivateSector,
      percentile25: data.percentile25,
      percentile75: data.percentile75,
      textResultLow: data.textResultLow,
      textResultMedium: data.textResultMedium,
      textResultHigh: data.textResultHigh,
      descriptionText: data.descriptionText,
      questions: [], // questions will be populated next
    };
    
    const questionsRef = collection(domainDoc.ref, 'questions');
    const questionsSnap = await getDocs(questionsRef);
    
    domainData.questions = questionsSnap.docs.map(qDoc => ({ ...qDoc.data(), id: qDoc.id } as Question));
    domains.push(domainData);
  }

  templateData.domains = domains;
  return templateData;
}


function filterRespondents(respondents: Respondent[], filters: Filters): Respondent[] {
  return respondents.filter(respondent => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      // Handle cases where respondent.demographics might be undefined or a string
      const demo = (typeof respondent.demographics === 'string') 
        ? JSON.parse(respondent.demographics) 
        : respondent.demographics;

      if (!demo) return false;
      return demo[key as keyof Demographics] === value;
    });
  });
}

function analyzeQuestion(questionId: string, respondents: Respondent[]): { average_score: number; sentiment_distribution: any } {
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
    const { average_score, sentiment_distribution } = analyzeQuestion(q.id, respondents);
    return {
      question_id: q.id,
      question_code: q.questionCode,
      question_text: q.questionText,
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
    domain_id: domain.id,
    domain_name: domain.name,
    domain_score,
    benchmark_private_sector: domain.benchmarkPrivateSector,
    percentile_25: domain.percentile25,
    percentile_75: domain.percentile75,
    text_result_low: domain.textResultLow,
    text_result_medium: domain.textResultMedium,
    text_result_high: domain.textResultHigh,
    description: domain.descriptionText,
    strong_point,
    weak_point,
    questions_analysis,
  };
}

export async function getDashboardData(firestore: Firestore, deploymentId: string, filters: Filters): Promise<DashboardData> {

  // 1. Fetch deployment details
  const deploymentRef = doc(firestore, 'survey_deployments', deploymentId);
  const deploymentSnap = await getDoc(deploymentRef);
  if (!deploymentSnap.exists()) {
      throw new Error("Pesquisa não encontrada.");
  }
  const deployment = deploymentSnap.data() as Omit<SurveyDeployment, 'id'>;

  // 2. Fetch all respondents and their answers for this deployment
  const allRespondents = await getRespondentsWithAnswers(firestore, deploymentId);
  
  // 3. Get the full survey template dynamically from Firestore
  const template = await getFullSurveyTemplate(firestore, deployment.templateId);

  // 4. Filter respondents based on the dashboard filters
  const filteredRespondents = filterRespondents(allRespondents, filters);

  // 5. Analyze domains based on filtered respondents
  const domain_analysis = template.domains.map(domain => analyzeDomain(domain, filteredRespondents));

  // 6. Calculate summary stats
  const total_respondents = filteredRespondents.length;
  const completion_rate = deployment.totalInvited > 0 ? (allRespondents.length / deployment.totalInvited) * 100 : 0;
  
  // 7. Get available demographic options from all respondents (before filtering)
  const getDemoOptions = (key: keyof Demographics) => {
    const options = new Set<string>();
    allRespondents.forEach(r => {
        const demo = (typeof r.demographics === 'string') 
            ? JSON.parse(r.demographics) 
            : r.demographics;
        if (demo && demo[key]) {
            options.add(demo[key]);
        }
    });
    return ['all', ...Array.from(options)];
  };

  const demographic_options = {
    units: getDemoOptions('unit'),
    sectors: getDemoOptions('sector'),
    positions: getDemoOptions('position'),
    age_ranges: getDemoOptions('age_range'),
    genders: getDemoOptions('gender'),
    current_role_times: getDemoOptions('current_role_time'),
  };

  return {
    total_respondents,
    completion_rate,
    surveyStatus: deployment.status as SurveyStatus,
    domain_analysis,
    demographic_options
  };
}
