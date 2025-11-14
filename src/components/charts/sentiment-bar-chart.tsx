import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface SentimentBarChartProps {
    favorable: number;
    neutral: number;
    unfavorable: number;
}

export default function SentimentBarChart({ favorable, neutral, unfavorable }: SentimentBarChartProps) {
    const total = favorable + neutral + unfavorable;
    if (total === 0) {
        return <div className="h-4 w-full bg-muted rounded-full"></div>;
    }

    const segments = [
        { percentage: unfavorable, color: 'bg-red-400', label: 'Desfavorável' },
        { percentage: neutral, color: 'bg-yellow-400', label: 'Neutro' },
        { percentage: favorable, color: 'bg-green-400', label: 'Favorável' },
    ];
    
    return (
        <TooltipProvider>
            <div className="flex w-full h-4 rounded-full overflow-hidden bg-muted">
                {segments.map((segment, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <div 
                                className={`h-full transition-all duration-300 ${segment.color}`} 
                                style={{ width: `${segment.percentage}%` }}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{segment.label}: {segment.percentage.toFixed(1)}%</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}
