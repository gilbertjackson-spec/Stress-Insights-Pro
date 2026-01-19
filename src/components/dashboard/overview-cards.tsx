import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData, SurveyDeployment } from "@/lib/types";
import { Users, Target, CheckCircle, PieChart, Heart } from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import SentimentBarChart from "../charts/sentiment-bar-chart";

interface OverviewCardsProps {
    data: DashboardData;
    isLoading: boolean;
}

export default function OverviewCards({ data, isLoading }: OverviewCardsProps) {
    const { total_respondents, completion_rate, surveyStatus, overall_sentiment } = data;
    const cards = [
        {
            title: "Total de Respondentes",
            value: total_respondents,
            icon: Users,
            description: "Número de participantes com o filtro atual.",
        },
        {
            title: "Taxa de Adesão Geral",
            value: `${completion_rate.toFixed(1)}%`,
            icon: PieChart,
            description: "Baseado no total de convidados.",
        },
        {
            title: "Sentimento Geral",
            value: `${overall_sentiment.favorable_perc.toFixed(1)}%`,
            icon: Heart,
            description: "Percentual de respostas favoráveis.",
            component: <div className="mt-2"><SentimentBarChart favorable={overall_sentiment.favorable_perc} neutral={overall_sentiment.neutral_perc} unfavorable={overall_sentiment.unfavorable_perc} /></div>
        },
        {
            title: "Status da Pesquisa",
            value: surveyStatus,
            icon: CheckCircle,
            description: "O estado atual da coleta de respostas.",
        }
    ];

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{card.value}</div>
                        {"component" in card && card.component}
                        {card.description && <p className="text-xs text-muted-foreground mt-1">{card.description}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
