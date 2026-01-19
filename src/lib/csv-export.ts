'use client';

import { Firestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { Answer, Demographics, Question, Respondent, SurveyDeployment, SurveyTemplate, Domain } from './types';
import type { Filters } from './analysis';


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

function convertToCSV(data: Respondent[], questions: Question[]): string {
    if (!data.length) return '';

    // Define headers: demographics first, then sorted question codes.
    const demographicHeaders = ['Unidade', 'Setor', 'Cargo', 'Faixa Etária', 'Tempo no Cargo Atual', 'Gênero'];
    // Use question text for headers for better readability, and sort by question code.
    const sortedQuestions = [...questions].sort((a, b) => a.questionCode.localeCompare(b.questionCode));
    const questionHeaders = sortedQuestions.map(q => `"${q.questionCode}: ${q.questionText.replace(/"/g, '""')}"`);
    
    const headers = ['ID do Respondente', ...demographicHeaders, ...questionHeaders].join(',');
    
    const rows = data.map(respondent => {
        const respondentId = respondent.id;
        const demographics = (typeof respondent.demographics === 'string')
            ? JSON.parse(respondent.demographics)
            : respondent.demographics || {};
        
        // Match demographic headers to the data
        const demographicValues = [
            `"${(demographics.unit || '').replace(/"/g, '""')}"`,
            `"${(demographics.sector || '').replace(/"/g, '""')}"`,
            `"${(demographics.position || '').replace(/"/g, '""')}"`,
            `"${(demographics.age_range || '').replace(/"/g, '""')}"`,
            `"${(demographics.current_role_time || '').replace(/"/g, '""')}"`,
            `"${(demographics.gender || '').replace(/"/g, '""')}"`,
        ];
        
        // Create a map of questionId -> rawResponse for efficient lookup
        const answerMap = new Map(respondent.answers?.map((a: Answer) => [a.questionId, a.rawResponse]));
        
        // Map answers based on the sorted question order
        const answerValues = sortedQuestions.map(q => {
            const answer = answerMap.get(q.id) || '';
            // Escape double quotes within the answer and wrap in double quotes
            return `"${answer.replace(/"/g, '""')}"`;
        });
        
        // Join all parts for the row
        return [respondentId, ...demographicValues, ...answerValues].join(',');
    });
    
    // Add BOM for UTF-8 Excel compatibility
    const BOM = '\uFEFF';
    return BOM + [headers, ...rows].join('\n');
}


export async function exportSurveyData(firestore: Firestore, deploymentId: string, filters: Filters, deploymentName: string) {
    // 1. Fetch deployment to get templateId
    const deploymentRef = doc(firestore, 'survey_deployments', deploymentId);
    const deploymentSnap = await getDoc(deploymentRef);
    if (!deploymentSnap.exists()) {
        throw new Error("Pesquisa não encontrada.");
    }
    const deployment = deploymentSnap.data() as SurveyDeployment;

    // 2. Fetch all data
    const [allRespondents, template] = await Promise.all([
        getRespondentsWithAnswers(firestore, deploymentId),
        getFullSurveyTemplate(firestore, deployment.templateId),
    ]);

    // 3. Filter respondents
    const filteredRespondents = filterRespondents(allRespondents, filters);

    if (filteredRespondents.length === 0) {
        // Using an alert for immediate user feedback. A toast could also be used.
        alert('Nenhum dado de resposta encontrado para os filtros selecionados.');
        return;
    }
    
    // 4. Get all questions from template
    const allQuestions = template.domains.flatMap(d => d.questions);

    // 5. Convert to CSV
    const csvContent = convertToCSV(filteredRespondents, allQuestions);
    
    // 6. Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const safeDeploymentName = deploymentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute("download", `respostas_${safeDeploymentName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
