'use client';

import type { Company, DashboardData, DomainAnalysis, SurveyDeployment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import DomainsRadarChart from "../charts/domains-radar-chart";
import DomainScoreGauge from "../charts/domain-score-gauge";
import QuestionBreakdown from "./question-breakdown";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface FullReportProps {
    data: DashboardData;
    company: Company;
    deployment: SurveyDeployment;
}

const ReportSection = ({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) => (
    <section className={cn("pdf-section space-y-4", className)}>
        {title && <h2 className="text-2xl font-bold font-headline text-primary">{title}</h2>}
        <div className="prose prose-sm lg:prose-base dark:prose-invert max-w-none text-foreground/90">
            {children}
        </div>
    </section>
);


const DomainReportSection = ({ domain }: { domain: DomainAnalysis }) => (
     <div className="mt-8 break-inside-avoid">
        <h3 className="text-xl font-semibold font-headline mb-4">{domain.domain_name}</h3>
        <p className="text-sm italic text-muted-foreground">{domain.description}</p>
        <div className="my-6 p-6 bg-secondary/50 rounded-lg">
            <h4 className="font-bold mb-2">Diagnóstico e Interpretação</h4>
            <p>{getDiagnosticText(domain)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
                <DomainScoreGauge 
                    score={domain.domain_score}
                    p25={domain.percentile_25}
                    p75={domain.percentile_75}
                    benchmark={domain.benchmark_private_sector}
                />
            </div>
            <div>
                <h4 className="font-bold mb-2 text-center">Análise por Pergunta</h4>
                <div className="space-y-2">
                {domain.questions_analysis.map(qa => (
                    <QuestionBreakdown key={qa.question_id} questionAnalysis={qa} />
                ))}
                </div>
            </div>
        </div>
        <Separator className="my-8" />
     </div>
);


const getDiagnosticText = (domain: DomainAnalysis) => {
    if (domain.domain_score < domain.percentile_25) {
        return domain.text_result_low;
    } else if (domain.domain_score > domain.percentile_75) {
        return domain.text_result_high;
    } else {
        return domain.text_result_medium;
    }
};

export default function FullReport({ data, company, deployment }: FullReportProps) {
    const deploymentYear = new Date(deployment.startDate).getFullYear();
    const deploymentMonth = new Date(deployment.startDate).toLocaleString('default', { month: 'long' });

    return (
        <main className="max-w-4xl mx-auto p-4 sm:p-8 bg-card shadow-lg print:shadow-none">
            <style jsx global>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .prose {
                        font-size: 10pt;
                    }
                    h1 { font-size: 24pt; }
                    h2 { font-size: 18pt; }
                    h3 { font-size: 14pt; }
                }
                @page {
                    size: A4;
                    margin: 1.5cm;
                }
            `}</style>
            
            <div className="space-y-12">
                 <ReportSection className="text-center">
                    <header>
                        <h1 className="text-3xl font-bold font-headline">Relatório da Pesquisa de Indicadores de Estresse</h1>
                        <p className="text-lg text-muted-foreground">{company.name} - {deploymentMonth} de {deploymentYear}</p>
                    </header>
                </ReportSection>

                <ReportSection title="Resumo Executivo">
                    <p>
                        Este relatório resumido contém os resultados da pesquisa realizada pela {company.name} durante {deploymentMonth} de {deploymentYear}.
                        Esta pesquisa investigou as percepções sobre o trabalho na {company.name}.
                        {deployment.totalInvited} pessoas foram convidadas a completar a pesquisa e respostas foram obtidas de {data.total_respondents}.
                    </p>
                    <p>
                        A Ferramenta de Avaliação dos Indicadores de Risco Psicossociais (adaptada da SIT - Stress Indicator Tool da HSE) foi desenvolvida para medir as atitudes e percepções da força de trabalho sobre aspectos do trabalho que são conhecidos por estarem associados ao estresse relacionado ao trabalho.
                        A ferramenta faz parte de uma abordagem de avaliação de risco para ajudar os empregadores a gerenciar as causas do estresse no local de trabalho.
                    </p>
                    <p>
                        Este relatório resume as respostas fornecidas pelos seus funcionários. Isso permitirá que a {company.name} se concentre nas áreas prioritárias e faça melhorias direcionadas.
                    </p>
                </ReportSection>

                <ReportSection title="Como Seus Resultados São Apresentados">
                    <p>
                        O sistema de pontuação usado na pesquisa foi baseado em uma escala de 5 pontos. O sistema de pontuação é complexo, pois algumas escalas e itens são pontuados inversamente na ferramenta por razões psicométricas. Para apoiar sua interpretação, os resultados foram agrupados em três categorias: respostas favoráveis, neutras e desfavoráveis, mostradas como porcentagens dos respondentes.
                    </p>
                    <p>
                        A categoria neutra contém respostas que pontuaram 3 ("às vezes" ou "neutro"). As categorias favoráveis e desfavoráveis combinam as duas respostas em cada lado da escala. Por exemplo, para "Eu posso decidir quando fazer uma pausa", as respostas "Muitas vezes" e "Sempre" são combinadas para a porcentagem favorável, enquanto "Nunca" e "Raramente" são combinadas para a porcentagem desfavorável.
                    </p>
                     <p>
                        No primeiro gráfico abaixo, resumindo o desempenho organizacional geral, todas as pontuações são apresentadas de modo que uma pontuação alta indica características de trabalho saudáveis, e uma pontuação baixa indica características de trabalho menos saudáveis. Portanto, uma pontuação baixa pode indicar que a melhoria é necessária.
                    </p>
                </ReportSection>
                
                <ReportSection title="Principais Descobertas">
                    <p>
                        O gráfico a seguir mostra as pontuações médias da empresa para cada um dos domínios cobertos pela pesquisa, em comparação com os benchmarks para o setor privado. A linha vermelha indica a pontuação do 25º percentil e a linha verde indica a pontuação do 75º percentil para a amostra comparativa.
                    </p>
                    <ul className="break-inside-avoid">
                        <li>Organizações que pontuaram <strong>abaixo da linha vermelha</strong> pontuaram menos bem do que 75% das organizações.</li>
                        <li>Organizações que pontuaram <strong>entre a linha vermelha e a linha verde</strong> pontuaram dentro da média de 50% das organizações.</li>
                        <li>Pontuações <strong>acima da linha verde</strong> são melhores do que 75% das organizações.</li>
                    </ul>
                    <div className="py-8 not-prose">
                         <Card>
                            <CardHeader>
                                <CardTitle>Desempenho Geral vs. Benchmarks</CardTitle>
                                <CardDescription>Pontuação média por domínio</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DomainsRadarChart data={data.domain_analysis} />
                            </CardContent>
                        </Card>
                    </div>
                </ReportSection>

                <ReportSection title="Análise Detalhada por Domínio">
                    {data.domain_analysis.map(domain => (
                        <DomainReportSection key={domain.domain_id} domain={domain} />
                    ))}
                </ReportSection>
            </div>
        </main>
    )
}
