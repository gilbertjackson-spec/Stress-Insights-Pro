import { Badge } from "../ui/badge";

interface DomainScoreGaugeProps {
    score: number;
    p25: number;
    p75: number;
    benchmark: number;
}

const MAX_SCORE = 5;

export default function DomainScoreGauge({ score, p25, p75, benchmark }: DomainScoreGaugeProps) {
    const scorePercent = (score / MAX_SCORE) * 100;
    const p25Percent = (p25 / MAX_SCORE) * 100;
    const p75Percent = (p75 / MAX_SCORE) * 100;
    const benchmarkPercent = (benchmark / MAX_SCORE) * 100;
    
    const getScoreColor = (value: number) => {
        if (value < p25) return 'bg-red-500';
        if (value < p75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Pontuação do Domínio</p>
                <p className={`text-5xl font-bold ${getScoreColor(score).replace('bg-','text-')}`}>{score.toFixed(2)}</p>
            </div>
            <div className="relative w-full h-3 bg-muted rounded-full">
                <div className="absolute h-full bg-red-200 dark:bg-red-800/50 rounded-l-full" style={{ width: `${p25Percent}%` }}></div>
                <div className="absolute h-full bg-yellow-200 dark:bg-yellow-800/50" style={{ left: `${p25Percent}%`, width: `${p75Percent - p25Percent}%` }}></div>
                <div className="absolute h-full bg-green-200 dark:bg-green-800/50 rounded-r-full" style={{ left: `${p75Percent}%`, width: `${100 - p75Percent}%` }}></div>
                
                {/* Your Score Marker */}
                <div 
                    className="absolute -top-1.5 h-6 w-1.5 rounded-full border-2 border-white dark:border-gray-800" 
                    style={{ 
                        left: `${scorePercent}%`,
                        backgroundColor: 'hsl(var(--primary))',
                        transform: 'translateX(-50%)'
                    }}
                />

                {/* Benchmark Marker */}
                <div className="absolute -bottom-2 h-4 w-0.5 bg-foreground/50" style={{ left: `${benchmarkPercent}%` }}>
                     <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Benchmark</p>
                     </div>
                </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1 pt-2">
                <span>0</span>
                <span>{p25.toFixed(2)} (p25)</span>
                <span>{p75.toFixed(2)} (p75)</span>
                <span>{MAX_SCORE}</span>
            </div>
        </div>
    );
}
