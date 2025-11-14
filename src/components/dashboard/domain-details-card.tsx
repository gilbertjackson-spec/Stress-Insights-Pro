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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <DomainScoreGauge score={domain.domain_score} p25={domain.percentile_25} p75={domain.percentile_75} benchmark={domain.benchmark_private_sector} />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <p className="text-sm text-muted-foreground">{domain.description}</p>
                    <div className="bg-secondary p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Diagnóstico e Interpretação</h4>
                        <p className="text-sm">{getDiagnosticText()}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {domain.strong_point && (
                             <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                <h5 className="text-sm font-semibold text-green-800 dark:text-green-300">Ponto Forte</h5>
                                <p className="text-xs text-green-700 dark:text-green-400 mt-1">{domain.strong_point.question_text}</p>
                                <p className="text-right font-bold text-green-600 dark:text-green-300 mt-2">{domain.strong_point.average_score.toFixed(2)}</p>
                             </div>
                        )}
                         {domain.weak_point && (
                             <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                <h5 className="text-sm font-semibold text-red-800 dark:text-red-300">Ponto Fraco</h5>
                                <p className="text-xs text-red-700 dark:text-red-400 mt-1">{domain.weak_point.question_text}</p>
                                <p className="text-right font-bold text-red-600 dark:text-red-300 mt-2">{domain.weak_point.average_score.toFixed(2)}</p>
                             </div>
                        )}
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
