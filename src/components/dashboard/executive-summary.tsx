import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import DomainsRadarChart from "../charts/domains-radar-chart";
import { Button } from "../ui/button";
import AiRecommendationsDialog from "./ai-recommendations-dialog";


interface ExecutiveSummaryProps {
    data: DashboardData;
    isLoading: boolean;
}

export default function ExecutiveSummary({ data, isLoading }: ExecutiveSummaryProps) {
    if (isLoading) {
        return (
            <>
                <Card className="col-span-full lg:col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
                <Card className="col-span-full lg:col-span-3">
                     <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </>
        )
    }

    const sortedDomains = [...data.domain_analysis].sort((a, b) => b.domain_score - a.domain_score);
    const topDomains = sortedDomains.slice(0, 2);
    const bottomDomains = sortedDomains.slice(-2).reverse();

    return (
        <>
            <Card className="col-span-full lg:col-span-4">
                <CardHeader>
                    <CardTitle className="font-headline">Sumário Executivo</CardTitle>
                    <CardDescription>Visão geral dos scores de todos os domínios.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <DomainsRadarChart data={data.domain_analysis} />
                </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
                 <CardHeader>
                    <CardTitle className="font-headline">Destaques</CardTitle>
                    <CardDescription>Principais forças e áreas de risco identificadas.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Principais Forças</h3>
                        <div className="grid gap-3">
                            {topDomains.map(domain => (
                                <div key={domain.domain_id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                            <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="font-semibold">{domain.domain_name}</span>
                                    </div>
                                    <span className="font-bold text-lg">{domain.domain_score.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Principais Áreas de Risco</h3>
                        <div className="grid gap-3">
                             {bottomDomains.map(domain => (
                                <div key={domain.domain_id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                     <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                                            <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <span className="font-semibold">{domain.domain_name}</span>
                                    </div>
                                    <span className="font-bold text-lg">{domain.domain_score.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <AiRecommendationsDialog domainScores={data.domain_analysis.reduce((acc, domain) => {
                        acc[domain.domain_name] = domain.domain_score;
                        return acc;
                    }, {} as Record<string, number>)} />
                </CardContent>
            </Card>
        </>
    );
}
