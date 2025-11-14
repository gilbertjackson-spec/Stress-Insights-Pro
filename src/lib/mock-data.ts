import type { Company, SurveyTemplate, Respondent, Demographics, Answer, Sentiment } from './types';
import { DOMAIN_QUESTIONS_MAP, LIKERT_SCALE, INVERTED_DOMAINS } from './constants';

const questionsData: { code: string; text: string }[] = [
  { code: 'Q-01', text: 'Tenho clareza sobre os objetivos e as responsabilidades do meu cargo.' },
  { code: 'Q-02', text: 'Tenho autonomia para decidir como realizar meu trabalho.' },
  { code: 'Q-03', text: 'Diferentes grupos no trabalho exigem de mim coisas que são difíceis de combinar.' },
  { code: 'Q-04', text: 'Entendo como meu trabalho contribui para os objetivos da organização.' },
  { code: 'Q-05', text: 'Recebo o respeito que mereço dos meus colegas no trabalho.' },
  { code: 'Q-06', text: 'Tenho prazos inatingíveis.' },
  { code: 'Q-07', text: 'Posso contar com o apoio dos meus colegas quando preciso.' },
  { code: 'Q-08', text: 'Meu gestor direto me incentiva a desenvolver novas habilidades.' },
  { code: 'Q-09', text: 'Tenho que trabalhar em um ritmo muito intenso.' },
  { code: 'Q-10', text: 'Tenho voz sobre meu ritmo de trabalho.' },
  { code: 'Q-11', text: 'A organização me deixa claro o que se espera de mim.' },
  { code: 'Q-12', text: 'Tenho que negligenciar algumas das minhas tarefas porque tenho muito o que fazer.' },
  { code: 'Q-13', text: 'Sei a quem recorrer para resolver problemas relacionados ao trabalho.' },
  { code: 'Q-14', text: 'Há atritos ou animosidade entre os colegas de trabalho.' },
  { code: 'Q-15', text: 'Tenho controle sobre quando faço pausas.' },
  { code: 'Q-16', text: 'Diferentes pessoas podem me pedir para fazer coisas contraditórias no trabalho.' },
  { code: 'Q-17', text: 'Tenho uma compreensão clara do meu papel na organização.' },
  { code: 'Q-18', text: 'Sinto pressão para trabalhar longas horas.' },
  { code: 'Q-19', text: 'Tenho alguma palavra sobre a forma como faço o meu trabalho.' },
  { code: 'Q-20', text: 'Tenho que trabalhar muito rápido.' },
  { code: 'Q-21', text: 'Sou assediado(a) ou intimidado(a) no trabalho.' },
  { code: 'Q-22', text: 'Tenho demandas de trabalho realistas.' },
  { code: 'Q-23', text: 'Meu gestor me oferece feedback construtivo.' },
  { code: 'Q-24', text: 'Meus colegas estão dispostos a ouvir meus problemas de trabalho.' },
  { code: 'Q-25', text: 'Tenho acesso a oportunidades de desenvolvimento de carreira.' },
  { code: 'Q-26', text: 'Sou consultado(a) sobre as mudanças que me afetam.' },
  { code: 'Q-27', text: 'Os colegas me ajudam se o trabalho fica difícil.' },
  { code: 'Q-28', text: 'As mudanças no trabalho são bem comunicadas.' },
  { code: 'Q-29', text: 'Meu gestor me apoia nas minhas decisões de trabalho.' },
  { code: 'Q-30', text: 'Tenho flexibilidade para organizar meu horário de trabalho.' },
  { code: 'Q-31', text: 'Existe um bom espírito de equipe no meu time.' },
  { code: 'Q-32', text: 'Tenho o treinamento adequado para lidar com as mudanças.' },
  { code: 'Q-33', text: 'Meu gestor me trata com respeito.' },
  { code: 'Q-34', text: 'As relações de trabalho são tensas.' },
  { code: 'Q-35', text: 'Meu gestor está ciente das minhas responsabilidades.' },
];

let questionIdCounter = 1;

const surveyTemplate: SurveyTemplate = {
  template_id: 1,
  name: 'Ferramenta de Avaliação dos Indicadores de Risco Psicossociais AptaFlow',
  domains: Object.entries(DOMAIN_QUESTIONS_MAP).map(([domainName, questionCodes], index) => ({
    domain_id: index + 1,
    template_id: 1,
    name: domainName,
    benchmark_private_sector: parseFloat((3.1 + Math.random() * 0.5).toFixed(2)),
    percentile_25: parseFloat((2.8 + Math.random() * 0.4).toFixed(2)),
    percentile_75: parseFloat((3.6 + Math.random() * 0.4).toFixed(2)),
    text_result_low: `Sua pontuação para ${domainName} está abaixo do 25º percentil, sugerindo uma área de risco significativa. É crucial investigar as causas e implementar ações corretivas.`,
    text_result_medium: `Sua pontuação para ${domainName} está na média do setor, entre o 25º e o 75º percentil. Existem oportunidades de melhoria para elevar o bem-estar da equipe.`,
    text_result_high: `Sua pontuação para ${domainName} está acima do 75º percentil, indicando um ponto forte na organização. Continue nutrindo este ambiente positivo.`,
    description: `Este domínio mede ${domainName.toLowerCase()}, que se refere à carga de trabalho, padrões de trabalho e ambiente, e como eles afetam o bem-estar dos colaboradores.`,
    questions: questionCodes.map(code => {
      const question = questionsData.find(q => q.code === code);
      return {
        question_id: questionIdCounter++,
        domain_id: index + 1,
        question_code: code,
        question_text: question ? question.text : `Texto para a pergunta ${code}`,
        is_inverted_score: INVERTED_DOMAINS.includes(domainName),
      };
    }),
  })),
};

const DEMO_OPTIONS = {
  units: ['Unidade 01', 'Unidade 02', 'Unidade 03'],
  sectors: ['Setor 01', 'Setor 02', 'Setor 03', 'Setor 04', 'Setor 05'],
  current_role_times: ['Menos de 1 ano', 'Entre 1 e 2 anos', 'Entre 2 e 5 anos', 'Mais de 5 anos'],
  age_ranges: ['18-24', '25-34', '35-44', '45-54', '55+'],
  health_issues: ['Sim', 'Não', 'Prefiro não dizer'] as ('Sim' | 'Não' | 'Prefiro não dizer')[],
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

let respondentIdCounter = 1;
let answerIdCounter = 1;

const generateRespondents = (count: number): Respondent[] => {
  const respondents: Respondent[] = [];
  const allQuestions = surveyTemplate.domains.flatMap(d => d.questions);

  for (let i = 0; i < count; i++) {
    const demographics: Demographics = {
      unit: getRandomItem(DEMO_OPTIONS.units),
      sector: getRandomItem(DEMO_OPTIONS.sectors),
      current_role_time: getRandomItem(DEMO_OPTIONS.current_role_times),
      age_range: getRandomItem(DEMO_OPTIONS.age_ranges),
      health_issue: getRandomItem(DEMO_OPTIONS.health_issues),
    };

    const answers: Answer[] = allQuestions.map(question => {
      const raw_response_index = Math.floor(Math.random() * LIKERT_SCALE.length);
      const raw_response = LIKERT_SCALE[raw_response_index];
      const base_score = raw_response_index + 1;
      const calculated_score = question.is_inverted_score ? 6 - base_score : base_score;
      
      let sentiment: Sentiment;
      if (calculated_score <= 2) sentiment = 'Desfavorável';
      else if (calculated_score === 3) sentiment = 'Neutro';
      else sentiment = 'Favorável';

      return {
        answer_id: answerIdCounter++,
        respondent_id: respondentIdCounter,
        question_id: question.question_id,
        raw_response,
        calculated_score,
        sentiment,
      };
    });

    respondents.push({
      respondent_id: respondentIdCounter++,
      deployment_id: 1,
      status: 'completed',
      demographics,
      answers,
    });
  }
  return respondents;
};

export const mockCompany: Company = {
  company_id: 1,
  name: 'Empresa-Cliente Exemplo',
  deployments: [
    {
      deployment_id: 1,
      template_id: 1,
      company_id: 1,
      start_date: '2024-05-01',
      end_date: '2024-05-31',
      status: 'closed',
      total_invited: 150,
      respondents: generateRespondents(112),
    },
  ],
};

export const getMockSurveyTemplate = (): SurveyTemplate => surveyTemplate;
