import type { SurveyTemplate } from './types';
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
  id: 1,
  name: 'Ferramenta de Avaliação dos Indicadores de Risco Psicossociais AptaFlow',
  domains: Object.entries(DOMAIN_QUESTIONS_MAP).map(([domainName, questionCodes], index) => ({
    id: index + 1,
    templateId: 1,
    name: domainName,
    benchmarkPrivateSector: parseFloat((3.1 + Math.random() * 0.5).toFixed(2)),
    percentile25: parseFloat((2.8 + Math.random() * 0.4).toFixed(2)),
    percentile75: parseFloat((3.6 + Math.random() * 0.4).toFixed(2)),
    textResultLow: `Sua pontuação para ${domainName} está abaixo do 25º percentil, sugerindo uma área de risco significativa. É crucial investigar as causas e implementar ações corretivas.`,
    textResultMedium: `Sua pontuação para ${domainName} está na média do setor, entre o 25º e o 75º percentil. Existem oportunidades de melhoria para elevar o bem-estar da equipe.`,
    textResultHigh: `Sua pontuação para ${domainName} está acima do 75º percentil, indicando um ponto forte na organização. Continue nutrindo este ambiente positivo.`,
    description: `Este domínio mede ${domainName.toLowerCase()}, que se refere à carga de trabalho, padrões de trabalho e ambiente, e como eles afetam o bem-estar dos colaboradores.`,
    questions: questionCodes.map(code => {
      const question = questionsData.find(q => q.code === code);
      return {
        id: questionIdCounter++,
        domainId: index + 1,
        questionCode: code,
        questionText: question ? question.text : `Texto para a pergunta ${code}`,
        isInvertedScore: INVERTED_DOMAINS.includes(domainName),
      };
    }),
  })),
};


export const getMockSurveyTemplate = (): SurveyTemplate => surveyTemplate;
