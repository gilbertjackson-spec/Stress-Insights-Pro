import type { DomainAnalysis } from "@/lib/types";
import DomainScoreGauge from "../charts/domain-score-gauge";
import QuestionBreakdown from "./question-breakdown";

interface DomainDetailsCardProps {
    domain: DomainAnalysis;
}

export default function DomainDetailsCard({ domain }: DomainDetailsCardProps) {

    const getDiagnosticText = () => {
        if (domain.domain_score < domain.percentile_25) {
            return domain.text_result_low;
        } else if (domain.domain_score > domain.percentile_75) {
            return domain.text_result_high;
        } else {
            return domain.text_result_medium;
        }
    };
    
    return (
        <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/30">
                    <DomainScoreGauge score={domain.domain_score} p25={domain.percentile_25} p75={domain.percentile_75} benchmark={domain.benchmark_private_sector} />
                </div>
                <div className="md:col-span-7 space-y-4">
                     <div>
                        <h4 className="font-semibold mb-2 text-base">O que este domínio mede?</h4>
                        <p className="text-sm text-muted-foreground">{domain.description}</p>
                     </div>
                    <div className="bg-secondary p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-base">Diagnóstico e Interpretação</h4>
                        <p className="text-sm">{getDiagnosticText()}</p>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-semibold font-headline mb-4">Análise por Pergunta</h4>
                <div className="space-y-4">
                    {domain.questions_analysis.map(qa => (
                        <QuestionBreakdown key={qa.question_id} questionAnalysis={qa} />
                    ))}
                </div>
            </div>
        </div>
    );
}
