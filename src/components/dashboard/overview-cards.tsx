import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/lib/types";
import { Users, Target, CheckCircle } from "lucide-react";

interface OverviewCardsProps {
    data: DashboardData;
    isLoading: boolean;
}

export default function OverviewCards({ data, isLoading }: OverviewCardsProps) {
    const { total_respondents, completion_rate } = data;
    const cards = [
        {
            title: "Total de Respondentes",
            value: total_respondents,
            icon: Users,
            change: null,
        },
        {
            title: "Taxa de Adesão",
            value: `${completion_rate.toFixed(1)}%`,
            icon: Target,
            change: "em relação ao total convidado",
        },
        // You can add more cards here, e.g., for average sentiment
        {
            title: "Status da Pesquisa",
            value: "Fechada",
            icon: CheckCircle,
            change: null,
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
                        <div className="text-2xl font-bold">{card.value}</div>
                        {card.change && <p className="text-xs text-muted-foreground">{card.change}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
