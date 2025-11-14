"use client";

import { useEffect, useState } from 'react';
import type { DashboardData } from '@/lib/types';
import type { Filters } from '@/lib/analysis';
import { getDashboardData } from '@/lib/analysis';
import { useFirestore } from '@/firebase';
import Link from 'next/link';

import DashboardFilters from './filters';
import OverviewCards from './overview-cards';
import ExecutiveSummary from './executive-summary';
import DomainAccordion from './domain-accordion';
import DashboardSkeleton from './dashboard-skeleton';
import EmptyDashboard from './empty-dashboard';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Terminal, Printer } from 'lucide-react';

const initialFilters: Filters = {
    unit: 'all',
    sector: 'all',
    position: 'all',
    age_range: 'all',
    current_role_time: 'all',
};

interface MainDashboardProps {
    deploymentId: string;
}

export default function MainDashboard({ deploymentId }: MainDashboardProps) {
    const firestore = useFirestore();
    const [data, setData] = useState<DashboardData | null>(null);
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!deploymentId || !firestore) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getDashboardData(firestore, deploymentId, filters);
                setData(result);
            } catch(e: any) {
                console.error("Failed to load dashboard data:", e);
                setError(e.message || "Ocorreu um erro ao carregar os dados do dashboard.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [deploymentId, filters, firestore]);

    if (isLoading && !data) {
        return <DashboardSkeleton />;
    }
    
    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro ao carregar dados</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!data) {
      return <DashboardSkeleton />; // Should not happen if not loading and no error, but as a safeguard
    }
    
    const isInitialLoad = data.total_respondents === 0 && Object.values(filters).every(v => v === 'all');

    if (isInitialLoad) {
        return <EmptyDashboard />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Dashboard de Análise</h1>
                 <Button variant="outline" asChild>
                    <Link href={`/admin/reports/${deploymentId}/full-report`}>
                        <Printer className="mr-2 h-4 w-4" />
                        Gerar Relatório Completo
                    </Link>
                 </Button>
            </div>
            
            <DashboardFilters 
                options={data.demographic_options}
                filters={filters}
                setFilters={setFilters}
                disabled={isLoading}
            />

            {data.total_respondents > 0 ? (
                <>
                    <OverviewCards data={data} isLoading={isLoading} />
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <ExecutiveSummary data={data} isLoading={isLoading} />
                    </div>

                    <DomainAccordion data={data} isLoading={isLoading} />
                </>
            ) : (
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Nenhuma resposta encontrada</AlertTitle>
                    <AlertDescription>
                        Não há dados de resposta que correspondam aos filtros selecionados.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
