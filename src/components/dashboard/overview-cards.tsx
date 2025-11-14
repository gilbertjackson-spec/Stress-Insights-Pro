import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData, SurveyDeployment } from "@/lib/types";
import { Users, Target, CheckCircle, PieChart } from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

interface OverviewCardsProps {
    data: DashboardData;
    isLoading: boolean;
}

export default function OverviewCards({ data, isLoading }: OverviewCardsProps) {
    const { total_respondents, completion_rate, surveyStatus } = data;
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
        // You can add more cards here, e.g., for average sentiment
        {
            title: "Status da Pesquisa",
            value: surveyStatus,
            icon: CheckCircle,
            description: "O estado atual da coleta de respostas.",
        }
    ];

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{card.value}</div>
                        {card.description && <p className="text-xs text-muted-foreground">{card.description}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
