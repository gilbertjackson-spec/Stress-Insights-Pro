import type { QuestionAnalysis } from "@/lib/types";
import SentimentBarChart from "../charts/sentiment-bar-chart";
import { cn } from "@/lib/utils";

interface QuestionBreakdownProps {
    questionAnalysis: QuestionAnalysis;
}

export default function QuestionBreakdown({ questionAnalysis }: QuestionBreakdownProps) {
    const getScoreColor = (score: number) => {
        if (score < 3) return "text-red-500";
        if (score < 4) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="p-4 rounded-lg border bg-secondary/50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-3">
                    <p className="font-semibold text-sm">{questionAnalysis.question_code}. <span className="font-normal">{questionAnalysis.question_text}</span></p>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                    <div className="w-full">
                        <SentimentBarChart 
                            favorable={questionAnalysis.sentiment_distribution.favorable_perc} 
                            neutral={questionAnalysis.sentiment_distribution.neutral_perc}
                            unfavorable={questionAnalysis.sentiment_distribution.unfavorable_perc}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Média</span>
                        <span className={cn("text-xl font-bold", getScoreColor(questionAnalysis.average_score))}>
                            {questionAnalysis.average_score.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
