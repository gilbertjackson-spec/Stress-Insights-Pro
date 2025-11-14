"use client";

import { useEffect, useState } from 'react';
import type { DashboardData } from '@/lib/types';
import type { Filters } from '@/lib/analysis';
import { getDashboardData } from '@/lib/analysis';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardFilters from './filters';
import OverviewCards from './overview-cards';
import ExecutiveSummary from './executive-summary';
import DomainAccordion from './domain-accordion';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { useFirestore } from '@/firebase';

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

    if (!data || data.total_respondents === 0 && filters.unit === 'all' && filters.sector === 'all' && filters.position === 'all') {
        return (
            <div className='space-y-6'>
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Dashboard de Análise</h1>
                </div>
                 <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Nenhuma resposta ainda</AlertTitle>
                    <AlertDescription>
                        Ainda não há dados de resposta para esta pesquisa. Compartilhe o link para começar a coletar respostas.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    
    if (!data) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Dashboard de Análise</h1>
                 {/* Can add a date picker or other actions here */}
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

function DashboardSkeleton() {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <Skeleton className="md:col-span-4 lg:col-span-4 h-96" />
            <Skeleton className="md:col-span-3 lg:col-span-3 h-96" />
        </div>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }
