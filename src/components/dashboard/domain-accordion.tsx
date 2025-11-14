import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { DashboardData } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { DOMAIN_ICONS } from "@/lib/constants";
import DomainDetailsCard from "./domain-details-card";
import { cn } from "@/lib/utils";

interface DomainAccordionProps {
    data: DashboardData;
    isLoading: boolean;
}

export default function DomainAccordion({ data, isLoading }: DomainAccordionProps) {
    
    const getScoreColor = (score: number) => {
        if (score < 3) return "text-red-500";
        if (score < 4) return "text-yellow-500";
        return "text-green-500";
    };
    
    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold font-headline tracking-tight mb-4">Resultados por Domínio</h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {data.domain_analysis.map((domain, index) => {
                    const Icon = DOMAIN_ICONS[domain.domain_name];
                    return (
                        <AccordionItem value={`item-${index}`} key={domain.domain_id} className="border-none">
                             <AccordionTrigger className="bg-card hover:bg-secondary/80 px-4 py-3 rounded-lg shadow-sm data-[state=open]:rounded-b-none transition-all">
                                <div className="flex items-center gap-4">
                                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                                    <span className="text-base font-semibold font-headline">{domain.domain_name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn("text-lg font-bold", getScoreColor(domain.domain_score))}>
                                        {domain.domain_score.toFixed(2)}
                                    </span>
                                </div>
                             </AccordionTrigger>
                             <AccordionContent className="bg-card p-4 rounded-b-lg shadow-sm border-t">
                                <DomainDetailsCard domain={domain} />
                             </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    );
}
