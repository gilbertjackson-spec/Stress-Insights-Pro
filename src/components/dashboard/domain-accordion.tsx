'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { DashboardData } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { DOMAIN_ICONS } from "@/lib/constants";
import DomainDetailsCard from "./domain-details-card";
import { cn, getScoreColorClass } from "@/lib/utils";

interface DomainAccordionProps {
    data: DashboardData;
    isLoading: boolean;
}

export default function DomainAccordion({ data, isLoading }: DomainAccordionProps) {
    
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
                        <AccordionItem value={`item-${index}`} key={domain.domain_id} className="border-b-0 rounded-lg shadow-sm bg-card">
                             <AccordionTrigger className="px-4 py-3 rounded-lg data-[state=open]:rounded-b-none transition-all hover:no-underline hover:bg-secondary/50">
                                <div className="flex items-center gap-4 flex-1">
                                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                                    <span className="text-base font-semibold font-headline">{domain.domain_name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={cn("text-xl font-bold", getScoreColorClass(domain.domain_score))}>
                                        {domain.domain_score.toFixed(2)}
                                    </span>
                                </div>
                             </AccordionTrigger>
                             <AccordionContent className="p-4 border-t">
                                <DomainDetailsCard domain={domain} />
                             </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    );
}
