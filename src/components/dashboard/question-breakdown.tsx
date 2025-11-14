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
        <div className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="flex-1 mb-4 md:mb-0">
                    <p className="text-sm text-muted-foreground">{questionAnalysis.question_code}</p>
                    <p className="font-medium text-base leading-snug">{questionAnalysis.question_text}</p>
                </div>
                <div className="w-full md:w-56 flex items-center gap-4">
                    <div className="w-full flex-1">
                        <SentimentBarChart 
                            favorable={questionAnalysis.sentiment_distribution.favorable_perc} 
                            neutral={questionAnalysis.sentiment_distribution.neutral_perc}
                            unfavorable={questionAnalysis.sentiment_distribution.unfavorable_perc}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Média</span>
                        <span className={cn("text-2xl font-bold", getScoreColor(questionAnalysis.average_score))}>
                            {questionAnalysis.average_score.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
